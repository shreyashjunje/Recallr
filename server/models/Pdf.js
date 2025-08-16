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
      difficulty: { type: String, enum: ["easy", "medium", "hard"] },
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
      question: String,
      answer: String,
    },
  ],
  fileHash:{
    type:String,
    
   
  },
  filename:{
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

  
  // NEW: async pipeline status
  status: { 
    type: String, 
    enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"], 
    default: "UPLOADED" 
  },
  processing: {
    progress: { type: Number, default: 0 },   // 0..100
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String },
  },

  // NEW: metadata for tracing
  uploadedVia: { type: String, enum: ["web", "telegram"], default: "web" },
  originalName: { type: String },
  mimeType: { type: String },
});


pdfSchemas.index({ user: 1, fileHash: 1 }, { unique: true, sparse: true });
pdfSchemas.index({ user: 1, createdAt: -1 });
pdfSchemas.index({ user: 1, tags: 1 });

module.exports=mongoose.model("PDF",pdfSchemas)
