const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createColumn,
  getColumns,
  renameColumn,
  deleteColumn,
} = require("../controllers/columnController");

// ➕ Create Column
router.post("/", protect, createColumn);

// 📥 Get Columns by Project
router.get("/:projectId", protect, getColumns);

// ✏️ Rename Column
router.put("/:id", protect, renameColumn);

// ❌ Delete Column
router.delete("/:id", protect, deleteColumn);

module.exports = router;