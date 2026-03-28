const Task = require("../models/Task");
const mongoose = require("mongoose");

// ================================
// 📝 CREATE TASK
// ================================
exports.createTask = async (req, res) => {
  try {
    // ✅ SAFE ACCESS (DON’T destructure directly)
    const title = req.body.title;
    const projectId = req.body.projectId;
    const columnId = req.body.columnId;
    const priority = req.body.priority;
    const assignedTo = req.body.assignedTo;
    const dueDate = req.body.dueDate;

    // ✅ FIX labels (comes as string)
    const labels = req.body.labels ? JSON.parse(req.body.labels) : [];

    if (!title || !projectId || !columnId) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const task = await Task.create({
      title,
      projectId,
      columnId,
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      labels,

      // ✅ MULTER FILE
      attachment: req.file ? req.file.filename : null,

      activityLogs: [{ message: "Task created" }],
    });

    res.status(201).json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 📋 GET TASKS BY PROJECT
// ================================
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid Project ID",
      });
    }

    const tasks = await Task.find({
      projectId: projectId,
    })
      .populate("assignedTo", "name email")
      .populate("columnId") // ✅ IMPORTANT
      .sort({ order: 1 });

    res.json(tasks);

  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔄 MOVE TASK BETWEEN COLUMNS
// ================================
exports.updateTaskColumn = async (req, res) => {
  try {
    const { columnId } = req.body;

    if (!columnId) {
      return res.status(400).json({ message: "Column ID required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldColumn = task.columnId;

    task.columnId = columnId;

    // ✅ Activity log
    if (!task.activityLogs) {
      task.activityLogs = [];
    }

    task.activityLogs.push({
      message: `Moved to new column`,
    });

    await task.save();

    res.json(task);

  } catch (err) {
    console.error("MOVE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔄 UPDATE TASK ORDER
// ================================
exports.updateTaskOrder = async (req, res) => {
  try {
    const { order } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 📊 ANALYTICS (UPDATED)
// ================================
exports.getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find();

    const total = tasks.length;

    // ✅ Since no "status", we define completed by column name (optional improvement later)
    const completed = tasks.filter(t => t.columnId).length;

    const overdue = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    const priority = {
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };

    const users = {};
    tasks.forEach((t) => {
      if (t.assignedTo) {
        users[t.assignedTo] = (users[t.assignedTo] || 0) + 1;
      }
    });

    res.json({
      total,
      completed,
      overdue,
      priority,
      users,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};