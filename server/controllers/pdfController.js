const Pdf = require("../models/Pdf");
const pdfParse = require("pdf-parse");
const axios=require('axios')

const uploadPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, tags } = req.body;
    if (!title || !category || !tags) {
      return res
        .status(400)
        .json({ message: "Title, category, and tags are required." });
    }

    const normalizedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // // ✅ Download the file from Cloudinary
    // const cloudinaryUrl = file.path;
    // const axiosResponse = await axios.get(cloudinaryUrl, {
    //   responseType: "arraybuffer",
    // });
    // const buffer = Buffer.from(axiosResponse.data, "binary");

    // // ✅ Parse the PDF to count pages
    // const data = await pdfParse(buffer);
    // const pages = data.numpages;
const userId = "6891d415c8cd6309b50acd01"; // Replace with your MongoDB user _id

    const newPdf = new Pdf({
      user: userId,
      title,
      category,
      tags: normalizedTags,
      cloudinaryUrl: file.path, // uploaded file URL
      cloudinaryPublicId: file.filename, // public_id in Cloudinary
      uploadedAt: Date.now(),
      
    });

    await newPdf.save();

    res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadPdf };
