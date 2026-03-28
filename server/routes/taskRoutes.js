const router = require("express").Router();

const {
  protect,
  loadWorkspace,
  checkWorkspaceRole,
} = require("../middleware/authMiddleware");

const Task = require("../models/Task");

const multer = require("multer");
const path = require("path");

// ================================
// 🔥 MULTER CONFIG
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================================
const {
  createTask,
  getTasks,
  updateTaskOrder,
  updateTaskColumn,
  getAnalytics,
} = require("../controllers/taskController");

// ================================
// 📊 ANALYTICS (🔥 FIXED)
// ================================
router.get("/analytics", protect, getAnalytics);

// ================================
// 📝 CREATE TASK
// ================================
router.post(
  "/",
  protect,
  loadWorkspace, // requires workspaceId in body
  checkWorkspaceRole("admin", "manager", "member"),
  upload.single("file"),
  createTask
);

// ================================
// 📋 GET ALL TASKS (DEBUG)
// ================================
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ================================
// 📋 GET TASKS BY PROJECT
// ================================
router.get(
  "/:projectId",
  protect,
  getTasks // ❌ REMOVE loadWorkspace here
);

// ================================
// 🔄 MOVE TASK
// ================================
router.put(
  "/:id/move",
  protect,
  updateTaskColumn // ❌ REMOVE loadWorkspace
);

// ================================
// 🔄 UPDATE ORDER
// ================================
router.put(
  "/:id/order",
  protect,
  updateTaskOrder
);

module.exports = router;