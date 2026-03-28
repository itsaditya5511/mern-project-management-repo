const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        email: {
          type: String, // 🔥 for invite simulation
        },

        role: {
          type: String,
          enum: ["admin", "manager", "member"], // 🔥 important
          default: "member",
        },
      },
    ],
  },
  { timestamps: true } // 🔥 important for analytics
);

module.exports = mongoose.model("Workspace", workspaceSchema);