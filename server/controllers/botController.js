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
    // console.log("userId:", userId);

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
const linkTelegramAccount = async (chatId, token) => {
  try {
    const user = await User.findOne({ telegramLinkToken: token });
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
// const uploadTelegramPDF = async (req, res) => {
//   console.log("Uploading PDF from Telegram...");

//   try {
//     const telegramChatId = req.body.telegramChatId;
//     if (!telegramChatId) {
//       return res.status(400).json({ error: "telegramChatId is required" });
//     }

//     const userFound = await User.findOne({ telegramChatId });
//     if (!userFound) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     console.log(`Receiving file: ${req.file.originalname}`);

//     // Upload directly to Cloudinary from buffer
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "recallr",
//         public_id: `pdf_${Date.now()}_${telegramChatId}`,
//         format: "pdf",
//       },
//       async (error, result) => {
//         if (error) {
//           console.error("Cloudinary error:", error);
//           return res.status(500).json({ error: "Upload failed" });
//         }

//         console.log("Upload success:", result.secure_url);

//         console.log("PDF created:", pdf._id);
//         console.log("telegramChatId:", telegramChatId);
//         // Trigger AI in background

//         processWithGeminiAndNotify(pdf._id, telegramChatId);

//          const pdf = await PDF.create({
//           user: userFound._id,
//           fileUrl: result.secure_url,
//           publicId: result.public_id,
//           originalName: req.file.originalname,
//           status: "UPLOADED",
//         });

//         res.json({ success: true, message: "Processing started..." });
//       }
//     );

//     // Stream file buffer to Cloudinary
//     const stream = require("stream");
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(req.file.buffer);
//     bufferStream.pipe(uploadStream);

//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// AI Processing (runs in background)
// async function processWithGeminiAndNotify(pdfId, telegramChatId) {
//   try {
//     // 1. Mark as "PROCESSING"
//     // await PDF.findByIdAndUpdate(pdfId, { status: "PROCESSING" });

//     console.log("1")

//     const pdf = await PDF.findById(pdfId);

//     if (!pdf) return;

//     pdf.status = "PROCESSING";
//     await pdf.save();

//     console.log("2")

//     // 2. Get AI results
//     // const pdf = await PDF.findById(pdfId);
//     // const aiResults = await processWithGemini(pdf.fileUrl);
//     const aiResults = await processWithGemini(pdf.fileUrl); // Uses your REST API

//     console.log("3")

//     // 3. Update PDF db
//     await PDF.findByIdAndUpdate(pdfId, {
//       title: aiResults.title,
//       summary: aiResults.summary,
//       tags: aiResults.tags,
//       category: aiResults.category,
//       flashcards: aiResults.flashcards,
//       quiz: aiResults.quiz,
//       status: "READY",
//     });

//     // 4. Notify user
//     await notifyUser(
//       telegramChatId,
//       `✅ "${aiResults.title}" is ready! View it in your dashboard.`
//     );

//   } catch (error) {
//     console.error("Processing failed:", error);
//     await PDF.findByIdAndUpdate(pdfId, { status: "FAILED" });
//     await notifyUser(
//       telegramChatId,
//       "❌ Processing failed. Please try uploading again."
//     );
//   }
// }

const uploadTelegramPDF = async (req, res) => {
  console.log("Uploading PDF from Telegram...");

  try {
    const telegramChatId = req.body.telegramChatId;
    if (!telegramChatId) {
      return res.status(400).json({ error: "telegramChatId is required" });
    }

    const userFound = await User.findOne({ telegramChatId });
    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Receiving file: ${req.file.originalname}`);
    const buffer = req.file.buffer;

    // const uploadStream = cloudinary.uploader.upload_stream(
    //   {
    //     resource_type: "raw",
    //     folder: "recallr",
    //     public_id: `pdf_${Date.now()}_${telegramChatId}`,
    //     format: "pdf",
    //   },
    //   async (error, result) => {
    //     if (error) {
    //       console.error("Cloudinary error:", error);
    //       return res.status(500).json({ error: "Upload failed" });
    //     }

    //     console.log("Upload success:", result.secure_url);

    //     // STEP 1: Process with Gemini
    //     try {
    //       const aiResults = await processWithGemini(result.secure_url);

    //       console.log("AI processing results:", aiResults);

    //       // STEP 2: Create DB record with AI results
    //       const pdf = await PDF.create({
    //         user: userFound._id,
    //         fileUrl: result.secure_url,
    //         publicId: result.public_id,
    //         originalName: req.file.originalname,
    //         status: "READY", // Already processed
    //         title: aiResults.title,
    //         summary: aiResults.summary,
    //         tags: aiResults.tags,
    //         category: aiResults.category,
    //         flashcards: aiResults.flashcards,
    //         quiz: aiResults.quiz,
    //       });

    //       console.log("PDF created:", pdf._id);

    //       // STEP 3: Send results to user
    //       await bot.sendMessage(
    //         telegramChatId,
    //         `✅ Your PDF has been processed!\n\n` +
    //           `📄 *Title:* ${aiResults.title}\n` +
    //           `📝 *Summary:*\n${aiResults.summary}\n\n` +
    //           `🏷 *Tags:* ${aiResults.tags.join(", ")}\n` +
    //           `📂 *Category:* ${aiResults.category}`,
    //         { parse_mode: "Markdown" }
    //       );

    //       if (aiResults.flashcards?.length) {
    //         await bot.sendMessage(
    //           telegramChatId,
    //           `💡 Flashcards:\n` +
    //             aiResults.flashcards
    //               .map((fc, i) => `${i + 1}. ${fc.question} → ${fc.answer}`)
    //               .join("\n")
    //         );
    //       }

    //       if (aiResults.quiz?.length) {
    //         await bot.sendMessage(
    //           telegramChatId,
    //           `🧠 Quiz:\n` +
    //             aiResults.quiz
    //               .map((q, i) => `${i + 1}. ${q.question}`)
    //               .join("\n")
    //         );
    //       }

    //       res.json({ success: true, message: "Processing completed" });
    //     } catch (err) {
    //       console.error("AI processing failed:", err);
    //       res.status(500).json({ error: "AI processing failed" });
    //       await bot.sendMessage(
    //         telegramChatId,
    //         "❌ Processing failed. Please try uploading again."
    //       );
    //     }
    //   }
    // );

    // Pipe file buffer to Cloudinar

    // const stream = require("stream");
    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(req.file.buffer);
    // bufferStream.pipe(uploadStream);

    // Cloudinary upload as promise
    const uploadCloudinary = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "recallr",
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

    // Save DB entry
    const pdf = await PDF.create({
      user: userFound._id,
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
  linkTelegramAccount,
  uploadTelegramPDF,
};
