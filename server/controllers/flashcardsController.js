const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// import stream from "stream";
const stream = require("stream");

// import fs from "fs";
const fs = require("fs");
const { processFlashcardsWithGemini } = require("../services/geminiService");

const generateFlashcards = async (req, res) => {
  console.log("in the backend controller");
  const { userId, numCards, questionType, difficulty } = req.body;
  const file = req.file;

  console.log("userId", userId);
  console.log("numCards", numCards);
  console.log("questionType", questionType);
  console.log("difficulty", difficulty);

  try {
    if (!file) {
      res.status(400).json({ message: "file not found" });
      return;
    }

    console.log("uploading to the cloudinary");

    const uploadCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw", // for pdf, zip, doc etc.
            folder: "flashcards",
            access_mode: "public",
            public_id: `pdf_${Date.now()}_${file.name}`,
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

    const settings = {
      numCards,
      questionType,
      difficulty,
    };

    const flashcards = await processFlashcardsWithGemini(file,settings);

    console.log("got flashcards from the ai ");
    console.log("flashcards: ", flashcards);

    // const newpdf = await PDF.create({
    //   userId: req.body.userId,
    //   title: summary.title,
    //   tags: summary.tags,
    //   category: summary.category,
    //   cloudinaryUrl: NULL,
    //   cloudinaryPublicId: NULL,
    //   summary: summary.summary,
    //   isSumarised: true,
    // });
  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({ message: "can not generate summary" });
  }
};

module.exports = { generateFlashcards };
