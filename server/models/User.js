const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: { type: String }, // only for Google login
    createdAt: {
      type: Date,
      default: Date.now,
    },
    pdfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF",
      },
    ],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    attempts: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }],

    // Telegram fields
    telegramChatId: { type: String, default: null },
    telegramLinkToken: {
      token: { type: String },
      expiresAt: { type: Date },
    },
    // // Telegram integration fields
    // telegramChatId: { type: String, default: null },
    // telegramLinkToken: { type: String, default: null },
    // telegramLinkedAt: { type: Date, default: null },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
