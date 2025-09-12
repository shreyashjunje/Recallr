const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Account & Settings",
        "File & Upload Issues",
        "AI Assistance & Features",
        "Learning & Productivity Tips",
      ], // optional enum
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
