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
    role: { type: String, enum: ["user", "admin"], default: "user" },

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
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
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

    favouritePdfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF",
      },
    ],

    profilePicture: {
      type: String, // store image URL (e.g., from Cloudinary or local server)
      default:
        "https://res.cloudinary.com/demo/image/upload/v1692282928/default-avatar.png", // fallback
    },

    // // Telegram integration fields
    // telegramChatId: { type: String, default: null },
    // telegramLinkToken: { type: String, default: null },
    // telegramLinkedAt: { type: Date, default: null },

    name: {
      type: String,
    },
    dateOfBirth: { type: Date },
    bio: { type: String, default: "" },
    social: {
      linkedIn: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
