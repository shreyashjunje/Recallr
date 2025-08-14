const PDF = require("../models/Pdf");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;


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

    const newPdf = new PDF({
      user: userId,
      title,
      category,
      tags: normalizedTags,
      cloudinaryUrl: file.path, // uploaded file URL
      cloudinaryPublicId: file.filename, // public_id in Cloudinary
      uploadedAt: Date.now(),
    });

    await newPdf.save();

    // After saving newPdf
    await User.findByIdAndUpdate(userId, {
      $push: { pdfs: newPdf._id },
    });

    res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePdf = async (req, res) => {
  const userId = req.body.userId; // 🔹 grab from body
  const pdfId = req.body.pdfId; // 🔹 grab from body

  console.log("User ID::::::", userId);
  console.log("PDF ID:", pdfId);

  if (!userId || !pdfId) {
    return res.status(400).json({ message: "userId and pdfId are required" });
  }

  try {
    const user = await User.findById(userId);
    const pdf = await PDF.findById(pdfId);
    console.log("User:", user);
    console.log("PDF:", pdf);

    if (!user.pdfs.includes(pdfId)) {
      return res
        .status(400)
        .json({ message: "You do not have permission to delete this PDF" });
    }

    //delete pdf
    const deletedPDF = await PDF.findByIdAndDelete(pdfId);
    if (!deletedPDF) {
      return res.status(404).json({ message: "PDF not found" });
    }



    
      if (pdf && pdf.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(pdf.cloudinaryPublicId, {
          resource_type: "raw",
        });
      }
    

    user.pdfs.pull(pdfId);
    await user.save();

    res.status(200).json({ message: "pdf deleted successfully" });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "server error" });
  }
};

const editPdf = async (req, res) => {
  // const pdfId = req.params.id;
  // const userId = req.user._id;

  const pdfId = "6894b9fe70361535e7601039";
  const userId = "6891d415c8cd6309b50acd01";

  const { title, category, tags } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.pdfs.includes(pdfId)) {
      return res
        .status(400)
        .json({ message: "you do not have access to this pdf" });
    }

    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return res.status(400).json({ message: "PDF not found" });
    }

    // 4. Update only provided fields
    if (title !== undefined) pdf.title = title;
    if (category !== undefined) pdf.category = category;
    if (tags !== undefined) pdf.tags = tags; // Make sure it's an array in frontend

    await pdf.save();

    res.status(200).json({ message: "PDF updated successfully", pdf });
  } catch (err) {
    console.log("Error: ", err);
    res.status(400).json({ message: "server error" });
  }
};

const getPdfDetail = async (req, res) => {
  // const pdfId = req.params.id;
  // const userId = req.user._id;

  const pdfId = "6895109468d925e56de481b3";
  const userId = "6891d415c8cd6309b50acd01";

  try {
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(400).json({ message: "pdf not found" });
    }

    const user = await User.findById(userId);
    if (!user.pdfs.includes(pdfId)) {
      return res.status(400).json({ message: "Access Denied" });
    }

    res.status(200).json({ message: "fetched pdf: ", pdf });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "server error" });
  }
};

const getAllPdfs = async (req, res) => {
  console.log("inthe getAllPdfs function");
    const userId = req.query.userId; // 🔹 grab from query
  console.log("User ID:", userId);
  // const userId = "6891d415c8cd6309b50acd01";

  if (!userId) {
    return res.status(400).json({ message: "userId not found" });
  }

  try {
    const userpdfs = await PDF.find({ user: userId }).sort({ uploadedAt: -1 }); //newest first

    res
      .status(200)
      .json({ message: "Pdfs fetched successfully", pdfs: userpdfs });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { uploadPdf, deletePdf, editPdf, getPdfDetail, getAllPdfs };
