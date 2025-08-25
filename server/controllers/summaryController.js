const cloudinary = require("cloudinary").v2;
const PDF = require("../models/Pdf");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// server / controllers / botController.js;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// import stream from "stream";
const stream = require("stream");
const crypto = require("crypto");

// import fs from "fs";
const fs = require("fs");
const { processSummaryWithGemini } = require("../services/geminiService");
const User = require("../models/User");
// const Pdf = require("../models/Pdf");

const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};
const generateSummary = async (req, res) => {
  console.log("in the backend controller");
  const { customPrompt, userId } = req.body;
  const file = req.file;

  console.log("custom promt:", customPrompt);
  console.log("file:", file);
  console.log("userid:", userId);

  try {
    if (!file) {
      res.status(400).json({ message: "file not found" });
      return;
    }

    console.log("uploading to the cloudinary");

    // // Upload to Cloudinary
    // const uploadResult = await cloudinary.uploader.upload(file, {
    //   folder: "summaries", // optional folder in cloudinary
    //   resource_type: "auto", // handles pdf, images, videos, etc.
    // });
    // Cloudinary upload as promise
    const uploadCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw", // for pdf, zip, doc etc.
            folder: "summaries",
            access_mode: "public",
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);
      });
    };

    // usage
    const cloudResult = await uploadCloudinary(file.buffer);

    console.log("uploaded to the cloudinary");

    console.log("uploadedResult: ", cloudResult);

    // const fileUrl = uploadResult.secure_url;

    // generate file hash
    const fileHash = generateFileHash(file.buffer);

    // console.log("fileurl: ", fileurl);
    const summary = await processSummaryWithGemini(file, customPrompt);

    console.log("got summary from the ai ");
    console.log("summary: ", summary);

    const newpdf = await PDF.create({
      user: userId,
      title: summary.title,
      tags: summary.tags,
      category: summary.category,
      cloudinaryUrl: cloudResult.url || cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      isSummarized: true,
      fileHash,
      summaryGeneratedAt: Date.now(),
      originalName: file.originalname,
    });

    res.status(200).json({
      message: true,
      message: "summary generated successfully",
      data: newpdf,
    });
  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({ message: "can not generate summary" });
  }
};

const getAllSummaries = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user if not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const allSummaries = await PDF.find({ user: userId, isSummarized: true });

    return res.status(200).json({
      success: true,
      message: "all summaries fetched successfully",
      data: allSummaries,
    });
  } catch (err) {
    console.log("err->", err);
    res.status(500).json({
      success: false,
      message: "server error while fetching all summaries",
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "user id not found",
      });
    }
    if (!id) {
      return res.status(400).json({
        message: "summary id not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const summary = await PDF.findOne({
      _id: id,
      user: userId,
      isSummarized: true,
    });

    return res.status(200).json({
      success: true,
      message: "summary fetched successfully",
      data: summary,
    });
  } catch (err) {
    console.log("err->", err);
    res.status(500).json({
      success: false,
      message: "server error while fetching summary",
    });
  }
};

module.exports = { generateSummary, getAllSummaries, getSummary };
