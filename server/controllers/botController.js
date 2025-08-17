const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();
const { Readable } = require("stream");
const { uploadTelegram } = require("../middlewares/upload");

const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const PDF = require("../models/Pdf");
const Busboy = require("busboy");
const { processWithGemini } = require("../services/geminiService");
const bot = require("../bot");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateTelegramLink = async (req, res) => {
  try {
    console.log("reached the backedn controller...");
    const userId = req.user.id; // Assuming you have auth middleware
    console.log("userId:", userId);

    // Create token
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    // console.log("token generated:", token, "expires at:", expiresAt);

    // Save token in user
    await User.findByIdAndUpdate(userId, {
      telegramLinkToken: { token, expiresAt },
    });

    // Create link
    const botUsername = process.env.TELEGRAM_BOT_USERNAME;
    // console.log("botUsername:", botUsername);
    const link = `https://t.me/${botUsername}?start=${token}`;
    console.log("Generated link:", link);

    // res.json({ link });
    res.status(200).json({
      success: true,
      message: "Telegram link generated successfully",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate link" });
  }
};

// Called from bot when /start <token> is used
exports.linkTelegramAccount = async (chatId, token) => {
  try {
    console.log("token received:", token, "from chatId:", chatId);
    const user = await User.findOne({ "telegramLinkToken.token": token });
    if (!user) {
      return { success: false, message: "Invalid or expired token." };
    }

    // Link the Telegram account
    user.telegramChatId = chatId;
    user.telegramLinkToken = null;
    user.telegramLinkedAt = new Date();
    await user.save();

    return { success: true, message: "✅ Your Telegram is now linked!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "❌ Something went wrong." };
  }
};

const uploadTelegramPDF = async (req, res) => {
  console.log("Uploading PDF from Telegram...");

  try {
    console.log("in the try block of uploadTelegramPDF");
    const telegramChatId = req.body.telegramChatId;
    if (!telegramChatId) {
      return res.status(400).json({ error: "telegramChatId is required" });
    }
    console.log("telegramChatId:", telegramChatId);

    const userFound = await User.findOne({ telegramChatId });
    console.log("userFound:", userFound);
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("req.file::::::::", req.file);

    console.log(`Receiving file:----> ${req.file.originalname}`);

    console.log("1. PDF validated");

    const buffer = req.file.buffer;

    // Cloudinary upload as promise
    const uploadCloudinary = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "recallr",
          access_mode: "public",
          public_id: `pdf_${Date.now()}_${telegramChatId}`,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });

    const cloudResult = await uploadCloudinary; // Wait for Cloudinary upload

    console.log("Cloudinary upload success:", cloudResult.secure_url);
    // AI processing as promise
    const aiResults = await processWithGemini(cloudResult.secure_url); // Your AI function accepts buffer

    if (!aiResults || !aiResults.title) {
      throw new Error("AI processing returned invalid results");
    }
    // // Run in parallel
    // const [cloudResult, aiResults] = await Promise.all([
    //   uploadCloudinary,
    //   processAI,
    // ]);

    console.log("AI processing results:", aiResults);

    // Generate hash from file buffer
    const fileBuffer = req.file.buffer; // assuming Multer memoryStorage
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    // Save DB entry
    const pdf = await PDF.create({
      user: userFound._id,
      fileHash,
      cloudinaryUrl: cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      originalName: req.file.originalname,
      status: "READY",
      title: aiResults.title,
      summary: aiResults.summary,
      tags: aiResults.tags,
      category: aiResults.category,
      flashcards: aiResults.flashcards,
      quiz: aiResults.quiz,
    });

    // Notify user
    await bot.sendMessage(
      telegramChatId,
      `✅ *Your PDF has been processed!*\n\n` +
        `📄 *Title:* ${aiResults.title}\n` +
        `🏷 *Category:* ${aiResults.category}\n` +
        `🔖 *Tags:* ${aiResults.tags.join(", ")}\n\n` +
        { parse_mode: "Markdown" }
    );

    res.status(200).json({ success: true, message: "Processing completed" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  generateTelegramLink,
  uploadTelegramPDF,
};
