const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  // ✅ NEW: Link task to column
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true,
  },

  // ✅ Keep ordering for drag & drop
  order: {
    type: Number,
    default: 0,
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  dueDate: Date,

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  labels: [String],

  // ✅ Will be used in multer step
  attachment: String,

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);