const PDF = require("../models/Pdf");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const User = require("../models/User");
const {
  processSummaryWithGeminiFromUrl,
  processFlashcardsWithGeminiFromUrl,
  processQuizWithGeminiFromUrl,
} = require("../services/geminiService");
const Pdf = require("../models/Pdf");
const cloudinary = require("cloudinary").v2;
// import stream from "stream";
const stream = require("stream");
const crypto = require("crypto");

const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const uploadPdf = async (req, res) => {
  // const userId = req.body; // 🔹 grab from body
  // console.log("User ID--->:", userId);

  try {
    const file = req.file;
    console.log("File received:", file);
    const id = req.user.id; // 🔹 grab from body
    console.log("useriiiiiddd::", req.user?.id);

    console.log("user id in pdf uploader controller: ", id);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Title:", req.body.title);
    console.log("Category:", req.body.category);
    console.log("Tags:", req.body.tags); // will be a string like "React,JavaScript"
    const { title, category, tags } = req.body;
    // console.log("req.body:::", req.body);
    console.log("userId======:", id);
    if (!title || !category || !tags) {
      return res
        .status(400)
        .json({ message: "Title, category, and tags are required." });
    }

    const normalizedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    console.log("upto cloudinary upload");
    const buffer = file.buffer;

    // ✅ generate public delivery URL for PDF
    const uploadCloudinary = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "recallr",
          access_mode: "public",
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });
    // console.log("file buffer:::", file.buffer);
    const cloudResult = await uploadCloudinary;

    // console.log("PDF URL//////////:", pdfUrl);
    console.log("after cloudinary upload");

    const fileBuffer = req.file.buffer; // assuming Multer memoryStorage

    const fileHash = generateFileHash(file.buffer);

    const newPdf = new PDF({
      user: id,
      title,
      category,
      tags: normalizedTags,
      filename: file.originalname, // Store original filename
      cloudinaryUrl: cloudResult.url || cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      uploadedAt: Date.now(),
      fileHash,
      originalName: file.originalname,
    });

    await newPdf.save();

    const user = await User.findById(id);
    user.pdfs.push(newPdf._id);
    await user.save();

    // // After saving newPdf
    // await User.findByIdAndUpdate(id, {
    //   $push: { pdfs: newPdf._id },
    // });

    res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// const deletePdf = async (req, res) => {
//   const userId = req.body.userId; // 🔹 grab from body
//   const pdfId = req.body.pdfId; // 🔹 grab from body

//   console.log("userID from delete::::", userId);
//   console.log("pdfId from delete:::", pdfId);

//   if (!userId || !pdfId) {
//     return res.status(400).json({ message: "userId and pdfId are required" });
//   }

//   try {
//     const user = await User.findById(userId);
//     const pdf = await PDF.findById(pdfId);
//     console.log("User:", user);
//     console.log("PDF:", pdf);

//     if (!user.pdfs.some((id) => id.toString() === pdfId)) {
//       return res
//         .status(400)
//         .json({ message: "You do not have permission to delete this PDF" });
//     }

//     //delete pdf
//     const deletedPDF = await PDF.findByIdAndDelete(pdfId);
//     if (!deletedPDF) {
//       return res.status(404).json({ message: "PDF not found" });
//     }

//     if (pdf && pdf.cloudinaryPublicId) {
//       await cloudinary.uploader.destroy(pdf.cloudinaryPublicId, {
//         resource_type: "raw",
//       });
//     }

//     user.pdfs.pull(pdfId);
//     await user.save();

//     res.status(200).json({ message: "pdf deleted successfully" });
//   } catch (err) {
//     console.log("Error: ", err);
//     res.status(500).json({ message: "server error" });
//   }
// };
const deletePdf = async (req, res) => {
  const { pdfId } = req.body;
  const userId = req.user?.id; // 🔹 grab from body

  if (!userId || !pdfId) {
    return res.status(400).json({ message: "userId and pdfId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const pdf = await PDF.findById(pdfId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    console.log(
      "User PDFs:",
      user.pdfs.map((id) => id.toString())
    );
    console.log("Requested PDF ID:", pdfId);
    console.log(
      "User PDFs:",
      user.pdfs.map((id) => id.toString())
    );
    console.log("Requested PDF ID:", pdfId);

    // // check ownership
    // if (!user.pdfs.some((id) => id.equals(pdfId))) {
    //   return res
    //     .status(403)
    //     .json({ message: "You do not have permission to delete this PDF" });
    // }

    // delete from cloudinary first
    if (pdf.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(pdf.cloudinaryPublicId, {
        resource_type: "raw", // ✅ auto instead of raw
      });
    }

    // delete from DB
    await PDF.findByIdAndDelete(pdfId);

    // remove from user's list
    user.pdfs.pull(pdfId);
    await user.save();

    res.status(200).json({ message: "PDF deleted successfully" });
  } catch (err) {
    console.error("Error deleting PDF:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const editPdf = async (req, res) => {
  const userId = req.body.userId; // 🔹 grab from body
  const pdfId = req.body.pdfId; // 🔹 grab from body
  console.log("selectedpdfF", req.body);

  console.log("User ID-->::::::", userId);
  console.log("PDF ID-->:", pdfId);

  if (!userId || !pdfId) {
    return res.status(400).json({ message: "userId and pdfId are required" });
  }
  const { title, category, tags } = req.body; // 🔹 grab from body

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

  // const pdfId = "6895109468d925e56de481b3";
  // const userId = "6891d415c8cd6309b50acd01";

  try {
    // const userId = req.user?.id;
    const { id } = req.params;
    console.log("pdfId:", id);

    const pdf = await PDF.findById(id)
      .populate("user", "userName email") // get user info
      .populate({
        path: "quizzes",
        match: { pdf: id }, // only quizzes linked to this pdf
        select: "settings",
        populate: {
          path: "userId",
          select: "userName email",
        },
      });

    // const pdf = await PDF.findById(id).populate("quizzes");
    // console.log(pdf);

    if (!pdf) {
      return res.status(400).json({ message: "pdf not found" });
    }

    // const user = await User.findById(userId);
    // if (!user.pdfs.includes(pdfId)) {
    //   return res.status(400).json({ message: "Access Denied" });
    // }

    res
      .status(200)
      .json({ success: true, message: "fetched pdf successfully ", data: pdf });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "server error" });
  }
};

const getAllPdfs = async (req, res) => {
  console.log("inthe getAllPdfs function");
  // const userId = req.query.userId; // 🔹 grab from query
  // const userId = req.user.id; // 🔹 grab from query
  // console.log("User ID:", userId);

  const userId = req.user?.id;

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

const downloadPdf = async (req, res) => {
  try {
    const { cloudinaryUrl, filename } = req.body;

    console.log("Cloudinary URL:", cloudinaryUrl);
    console.log("Filename:", filename);

    if (!cloudinaryUrl) {
      return res.status(400).json({ error: "Cloudinary URL is required" });
    }

    // ensure it ends with .pdf (Cloudinary sometimes skips extension in raw URLs)
    const pdfUrl = cloudinaryUrl.endsWith(".pdf")
      ? cloudinaryUrl
      : cloudinaryUrl + ".pdf";

    console.log("1");

    // fetch from cloudinary
    const response = await axios({
      method: "get",
      url: pdfUrl,
      responseType: "stream",
    });
    console.log("2");
    // set headers to force download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename || "document.pdf"}`
    );
    console.log("3");
    res.setHeader("Content-Type", "application/pdf");

    console.log("4");

    res.send(response.data);
  } catch (error) {
    console.error("Error downloading PDF:", error.message);
    res.status(500).json({ error: "Failed to download PDF" });
  }
};

const generateSummaryOnly = async (req, res) => {
  const { fileUrl, fileName, customPrompt } = req.body;

  try {
    if (!fileUrl) {
      return res.status(400).json({ message: "No file URL provided" });
    }

    console.log("Fetching file from Cloudinary:", fileUrl);

    // 1. Pass Cloudinary file URL directly to Gemini
    const airesponse = await processSummaryWithGeminiFromUrl(
      fileUrl,
      fileName,
      customPrompt
    );

    const { summary, keyPoints } = airesponse;
    // 2. Find PDF doc by Cloudinary URL (or fileName) and update
    const updatedPdf = await Pdf.findOneAndUpdate(
      { cloudinaryUrl: fileUrl }, // match document
      {
        $set: {
          summary, // array of summary lines
          keyPoints, // key points array
          isSummarized: true, // flag
          summaryGeneratedAt: new Date(), // timestamp
        },
      },
      { new: true } // return updated document
    );

    if (!updatedPdf) {
      return res.status(404).json({ message: "PDF not found in database" });
    }

    res.status(200).json({
      message: "Summary generated & saved successfully",
      pdf: updatedPdf,
    });
  } catch (err) {
    console.error("❌ Error generating summary:", err);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};

// const generateFlashCardsOnly = async (req, res) => {
//   const { fileUrl, fileName, customPrompt } = req.body;

//   try {
//     if (!fileUrl) {
//       return res.status(400).json({ message: "No file URL provided" });
//     }

//     console.log("Fetching file from Cloudinary for flashcards:", fileUrl);

//     // 1. Call Gemini for flashcards (not summary)
//     const airesponse = await processFlashcardsWithGeminiFromUrl(
//       fileUrl,
//       customPrompt
//     );

//     const { flashcards } = airesponse;

//     // 2. Find PDF doc by Cloudinary URL and update flashcards
//     const updatedPdf = await Pdf.findOneAndUpdate(
//       { cloudinaryUrl: fileUrl }, // match document
//       {
//         $set: {
//           flashcards, // store flashcards array
//           isFlashcardGenerated: true, // flag
//           flashcardsGeneratedAt: new Date(), // timestamp
//         },
//       },
//       { new: true } // return updated document
//     );

//     if (!updatedPdf) {
//       return res.status(404).json({ message: "PDF not found in database" });
//     }

//     res.status(200).json({
//       message: "Flashcards generated & saved successfully",
//       pdf: updatedPdf,
//     });
//   } catch (err) {
//     console.error("❌ Error generating flashcards:", err);
//     res.status(500).json({ message: "Failed to generate flashcards" });
//   }
// };
const generateFlashCardsOnly = async (req, res) => {
  console.log("in the generte flashcards controller");
  const {
    fileUrl,
    fileName,
    customPrompt,
    numCards,
    questionType,
    difficulty,
  } = req.body;

  try {
    if (!fileUrl) {
      return res.status(400).json({ message: "No file URL provided" });
    }

    console.log("Fetching file from Cloudinary for flashcards:", fileUrl);

    // 1. Call Gemini with settings object
    const airesponse = await processFlashcardsWithGeminiFromUrl(fileUrl, {
      numCards,
      questionType,
      difficulty,
      customPrompt,
    });

    const { flashcards } = airesponse;

    // 2. Find PDF doc by Cloudinary URL and update flashcards
    const updatedPdf = await Pdf.findOneAndUpdate(
      { cloudinaryUrl: fileUrl },
      {
        $set: {
          flashcards,
          isFlashcardGenerated: true,
          flashcardsGeneratedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedPdf) {
      return res.status(404).json({ message: "PDF not found in database" });
    }

    res.status(200).json({
      message: "Flashcards generated & saved successfully",
      pdf: updatedPdf,
    });
  } catch (err) {
    console.error("❌ Error generating flashcards:", err);
    res.status(500).json({ message: "Failed to generate flashcards" });
  }
};
const generateQuizOnly = async (req, res) => {
  try {
    const {
      pdfId,
      fileUrl,
      fileName,
      // userId,
      numQuestions,
      difficulty,
      questionTypes,
      timeLimit,
      timeLimitType,
      mode,
      markingScheme,
      shuffleQuestions,
      shuffleOptions,
    } = req.body;

    const userId = req.user?.id;

    if (!fileUrl || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🎯 Generating quiz for:", fileUrl);

    // 1️⃣ Build settings object
    const settings = {
      numQuestions: parseInt(numQuestions) || 10,
      difficulty: difficulty || "Medium",
      questionTypes: Array.isArray(questionTypes)
        ? questionTypes
        : [questionTypes],
      timeLimit: parseInt(timeLimit) || 30,
      timeLimitType: timeLimitType || "overall",
      mode: mode || "Practice",
      markingScheme: markingScheme || "normal",
      shuffleQuestions:
        shuffleQuestions === "true" || shuffleQuestions === true,
      shuffleOptions: shuffleOptions === "true" || shuffleOptions === true,
    };

    // 2️⃣ Call Gemini
    const pdfData = await processQuizWithGeminiFromUrl(
      fileUrl,
      fileName,
      settings
    );

    if (!pdfData || !pdfData.questions) {
      return res.status(500).json({ message: "Failed to generate quiz" });
    }

    // 3️⃣ Create Quiz record
    const newQuiz = await Quiz.create({
      userId: userId,
      pdfId: pdfId || null,
      title: pdfData.title || "Generated Quiz",
      description: pdfData.description || "",
      category: pdfData.category || "General",
      tags: pdfData.tags || [],
      questions: pdfData.questions || [],
      settings,
      createdAt: Date.now(),
    });

    // 4️⃣ Update PDF (if linked)
    if (pdfId) {
      await Pdf.findByIdAndUpdate(pdfId, {
        $set: {
          isQuizGenerated: true,
          quizId: newQuiz._id,
          quizGeneratedAt: new Date(),
        },
      });
    }

    // 5️⃣ Send response
    res.status(200).json({
      message: "✅ Quiz generated successfully",
      quiz: newQuiz,
    });
  } catch (err) {
    console.error("❌ Error in generateQuizOnly:", err);
    res
      .status(500)
      .json({ message: "Failed to generate quiz", error: err.message });
  }
};

const updatePdfProgress = async (req, res) => {
  try {
    const { currentPage, totalPages } = req.body;

    if (!currentPage || !totalPages) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const progress = Math.round((currentPage / totalPages) * 100);

    const updatedDoc = await PDF.findByIdAndUpdate(
      req.params.id,
      { currentPage, totalPages: totalPages, progress },
      { new: true }
    );

    res.json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "user id not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const categories = await Pdf.distinct("category", { user: userId });

    // if(!categories){
    //   return res.status(400).json({message:"No categories found"})
    // }

    return res.status(200).json({
      success: true,
      data: categories,
      message: "categories fetched successfully",
    });
  } catch (err) {
    console.log("errorL", err);
    res,
      status(500).jaon({
        success: false,
        message: "server error while fetching catgories",
      });
  }
};

module.exports = {
  uploadPdf,
  deletePdf,
  editPdf,
  getPdfDetail,
  getAllPdfs,
  downloadPdf,
  generateSummaryOnly,
  generateFlashCardsOnly,
  updatePdfProgress,
  getCategories,
  generateQuizOnly,
};
