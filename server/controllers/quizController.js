const Quiz = require("../models/Quiz");
const crypto = require("crypto");
const { processQuizWithGemini } = require("../services/geminiService");
const Pdf = require("../models/Pdf");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const stream = require("stream");
const User = require("../models/User");

const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const generateQuiz = async (req, res) => {
  const formData = req.body;
  const file = req.file;
  //   const fileBuffer = req.file.buffer;
  //   console.log("File buffer:", fileBuffer);
  console.log("Received file:", file);
  console.log("Received form data:", formData);

  try {
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
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

    // generate file hash
    const fileHash = generateFileHash(file.buffer);

    const quizData = await processQuizWithGemini(file, formData);

    console.log("got data in the controller after ai processing");
    console.log("Quiz data processed:", quizData);

    // Save in MongoDB
    const newPdf = await Pdf.create({
      user: req.body.userId, // If you have auth
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      cloudinaryUrl: cloudResult.url || cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      tags: quizData.tags,
      isQuizGenerated: true,
      quizGeneratedAt: Date.now(),
      uploadedAt: Date.now(),
      fileHash,
      originalName: file.originalname,
    });

    const newQuiz = await Quiz.create({
      userId: req.body.userId,
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      tags: quizData.tags,
      questions: quizData.questions,
      settings: {
        numQuestions: formData.numQuestions,
        difficulty: formData.difficulty,
        questionTypes: formData.questionTypes,
        timeLimit: formData.timeLimit,
      },
    });

    console.log("after saving pdf and quiz to db");
    console.log("newPDF: ", newPdf);
    console.log("newquiz: ", newQuiz);

    res.status(200).json({
      message: "Quiz generated successfully",
      data: {
        newPdf,
        newQuiz,
      },
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Handle error appropriate
    return res.status(500).json({ error: "Failed to generate quiz" });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "user id not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const quizzes = await Quiz.find({ userId: userId });

    return res.status(200).json({
      success: true,
      message: "fetched all quizzes successfully",
      data: quizzes,
    });
  } catch (err) {
    console.log("err->", err);
    res.status(500).json({
      success: false,
      message: "server error fetching all quizzes",
    });
  }
};

const getQuiz = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({
        messsage: "user id not found",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "quiz id not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const quiz=await Quiz.findOne({_id:id,userId:userId})

    return res.status(200).json({
      success:true,
      message:"quiz fethched successfully",
      data:quiz
    })
  } catch (err) {
    console.log("err->", err);
    res.status(500).json({
      success: false,
      message: "Server error for fetching quiz",
    });
  }
};

module.exports = { generateQuiz, getAllQuizzes, getQuiz };
