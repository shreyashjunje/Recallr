const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "ticket_created",
        "ticket_updated",
        "ticket_resolved",
        "ticket_in_progress",
        "faq_created",
        "faq_updated",
        "user_login",
        "user_logout",
        "note_added",
        "other",
      ],
    },
    description: {
      type: String,
      default: "", // e.g. "Ticket marked as resolved by Admin"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // if you have a User model
      required: false,
    },
    userEmail: {
      type: String,
      required: false, // fallback if no User ref
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: false,
    },
    faqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FAQ",
      required: false,
    },
    meta: {
      type: Object,
      default: {}, // flexible extra data (e.g. { oldStatus: "open", newStatus: "resolved" })
    },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }, // for relation
    ticketCode: { type: String }, // store "TKT-2025-32834"
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Indexes for faster queries (optional but recommended)
activitySchema.index({ createdAt: -1 });
activitySchema.index({ action: 1 });
activitySchema.index({ userEmail: 1 });

module.exports = mongoose.model("Activity", activitySchema);
