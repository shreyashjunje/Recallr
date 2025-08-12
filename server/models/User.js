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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
