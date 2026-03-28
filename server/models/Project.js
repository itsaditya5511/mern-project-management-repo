const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },

  // ✅ Better structure for future (roles)
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["admin", "manager", "member"],
        default: "member",
      },
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);