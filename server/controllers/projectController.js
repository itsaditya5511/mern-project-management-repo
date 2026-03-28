const Project = require("../models/Project");
const mongoose = require("mongoose");

// ================================
// 📝 CREATE PROJECT
// ================================
exports.createProject = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    // 🔥 validate workspaceId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid Workspace ID",
      });
    }

    const project = await Project.create({
      name,
      workspaceId,
      members: [req.user._id],
    });

    res.status(201).json(project);

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 📋 GET PROJECTS BY WORKSPACE
// ================================
exports.getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // 🔥 prevent crash
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid Workspace ID",
      });
    }

    const projects = await Project.find({
      workspaceId,
    });

    res.json(projects);

  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};