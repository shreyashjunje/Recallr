const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "low" 
  },
  status: { 
    type: String, 
    enum: ["active", "completed"], 
    default: "active" 
  },
  dueDate: { 
    type: Date 
  },
  reminder: { 
    type: Date 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  linkedResource: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PDF",
    required: false 
  },
  completedAt: { 
    type: Date 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Auto update "updatedAt"
TaskSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
