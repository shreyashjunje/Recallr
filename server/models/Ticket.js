const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // null if guest
    },
    name: {
      type: String,
      required: function () {
        return !this.user; // required if no logged-in user
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.user;
      },
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    replies: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    notes: [
      {
        author: { type: String, default: "admin" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Generate ticketId before saving
ticketSchema.pre("save", function (next) {
  if (!this.ticketId) {
    // Example: TKT-2025-00001
    this.ticketId = `TKT-${new Date().getFullYear()}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
