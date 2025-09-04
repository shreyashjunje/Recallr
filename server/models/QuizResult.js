const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Performance
    score: { type: Number },
    totalQuestions: { type: Number },
    correct: { type: Number },
    wrong: { type: Number },
    skipped: { type: Number },

    // Per-question analytics
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        selectedAnswer: { type: String },
        isCorrect: { type: Boolean },
        timeTaken: { type: Number }, // seconds
      },
    ],

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    clientAttemptId: { type: String, index: true, sparse: true },
    durationSeconds: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizResult", quizAttemptSchema);
