const mongoose = require("mongoose");

const pdfSchemas = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "User",
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],

  summary: {
    type: String,
  },
  quiz: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  uploadedAt: {
    type: Date,
    derfault: Date.now(),
  },
  textExtracted: {
    type: String,
  },
  flashcards: [
    {
      front: String,
      back: String,
    },
  ],
  fileHash:{
    type:String,
    
   
  },

  isFlashcardGenerated: {
    type: Boolean,
    default: false,
  },
  isQuizGenerated: {
    type: Boolean,
    derfault: false,
  },
  isSummarized: {
    type: Boolean,
    default: false,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  pdfSize:{
    type:Number,
  },
  pages:{
    type:Number,
  },
  progress: {
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0, // in minutes
    },
    lastOpenedAt: {
      type: Date,
    },
  },
});

module.exports=mongoose.model("PDF",pdfSchemas)
