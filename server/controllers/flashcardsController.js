const cloudinary = require("cloudinary").v2;
const PDF = require("../models/Pdf");
const User = require("../models/User");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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
const { processFlashcardsWithGemini } = require("../services/geminiService");



const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

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

    
    // generate file hash
    const fileHash = generateFileHash(file.buffer);


    const flashcards = await processFlashcardsWithGemini(file, settings);

    console.log("got flashcards from the ai ");
    console.log("flashcards: ", flashcards);
    const newpdf = await PDF.create({
      user: userId,
      title: flashcards.title,
      tags: flashcards.tags,
      category: flashcards.category,
      cloudinaryUrl: cloudResult.url || cloudResult.secure_url,
      cloudinaryPublicId: cloudResult.public_id,
      isFlashcardGenerated:true,
      flashcards:flashcards.flashcards,
      uploadedAt:Date.now(),
      fileHash,
      flashcardsGeneratedAt: Date.now(),
      originalName: file.originalname,
    });

    res.status(200).json({
      message: true,
      message: "flashcards generated successfully",
      data: newpdf,
    });
  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({ message: "can not generate summary" });
  }
};

const getAllFlashcards = async (req, res) => {
  try {
    const userId = req.user.id || req.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user id not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.staus(400).json({
        success: false,
        message: "user not found",
      });
    }

    const allFlashcards = await PDF.find({
      user: userId,
      isFlashcardGenerated: true,
    });

    if (!allFlashcards) {
      return res.status(400).jaon({
        success: false,
        message: "no flashcards",
      });
    }

    return res.status(200).json({
      success: true,
      message: "all flashcards fetched successfullyt",
      data: allFlashcards,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({
      success: false,
      message: "server error for getting all flashcards",
    });
  }
};

const getFlashacards=async (req,res)=>{
  try{

    const userId=req.user?.id
    const {id}=req.params

    console.log("userId:",userId)
    console.log("flashcard id:",id)

    if(!id){
      return res.status(400).json({
        message:"flashcards id not found"
      })
    }

    if(!userId){
      return res.status(400).json({
        message:"user id not found"
      })
    }

    const user=await User.findById(userId);
    if(!user){
      return res.status(400).json({
        message:"user not found"
      })
    }

    console.log("user:",user);

    const flashcard=await PDF.findOne({_id:id,user:userId});
    console.log("flashcard:",flashcard)

    if(!flashcard){
      return res.status(400).json({
        message:"flashcard not found"
      })
    }

    console.log("flashcard",flashcard)

    return res.status(200).json({
      success:true,
      message:"flashcard fetched successfully",
      data:flashcard
    })


    

  }catch(err){
   console.log("Error-->",err);
   res.status(500).json({
    success:false,
    message:"server serror for getting flashcards"
   })
   
}


}

module.exports = { generateFlashcards, getAllFlashcards,getFlashacards };
