const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// server / controllers / botController.js;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// import stream from "stream";
const stream = require("stream");

// import fs from "fs";
const fs = require("fs");

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

    // console.log("fileurl: ", fileurl);
    const summary = await processSummaryWithGemini(file, customprompt);

    console.log("got summary from the ai ");
    console.log("summary: ",summary)

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

module.exports = { generateSummary };
