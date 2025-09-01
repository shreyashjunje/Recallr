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
    ref: "User",
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

  summary: [
    {
      type: String,
    },
  ],
  keyPoints: [
    {
      point: {
        type: String,
        required: true,
      },
      important: {
        type: Boolean,
        default: false,
      },
    },
  ],

  // quiz: [
  //   {
  //     question: String,
  //     options: [String],
  //     answer: String,
  //     difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  //   },
  // ],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }], // link quizzes here

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  textExtracted: {
    type: String,
  },
  flashcards: [
    {
      question: String,
      answer: String,
      difficulty: String,
      // ✅ Tracking
      isReviewed: { type: Boolean, default: true }, // has the user reviewed this?
      lastReviewedAt: { type: Date }, // when last reviewed
      reviewCount: { type: Number, default: 0 }, // how many times reviewed
      confidenceLevel: {
        type: String,
        enum: ["again", "hard", "good", "easy"], // spaced repetition style feedback
      },
    },
  ],
  fileHash: {
    type: String,
  },
  filename: {
    type: String,
  },

  isFlashcardGenerated: {
    type: Boolean,
    default: false,
  },
  isQuizGenerated: {
    type: Boolean,
    default: false,
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
  pdfSize: {
    type: Number,
  },
  pages: {
    type: Number,
  },

  totalPages: {
    type: Number,
    // required: true,
  },
  currentPage: {
    type: Number,
    default: 0, // track where user left off
  },
  progress: {
    type: Number,
    default: 0, // in percentage
  },

  quizGeneratedAt: { type: Date, default: null },
  flashcardsGeneratedAt: { type: Date, default: null },
  summaryGeneratedAt: { type: Date, default: null },
  status: {
    type: String,
    enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"],
    default: "UPLOADED",
  },
  processing: {
    progress: { type: Number, default: 0 }, // 0..100
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String },
  },
  uploadedVia: { type: String, enum: ["web", "telegram"], default: "web" },
  originalName: { type: String },
  mimeType: { type: String },
});

// pdfSchemas.index(
//   { user: 1, fileHash: 1 },
//   { unique: true, partialFilterExpression: { fileHash: { $type: "string" } } }
// );
// pdfSchemas.index({ user: 1, createdAt: -1 });
// pdfSchemas.index({ user: 1, tags: 1 });

module.exports = mongoose.model("PDF", pdfSchemas);
