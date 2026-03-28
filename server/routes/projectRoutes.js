const router = require("express").Router();

const {
  protect,
  loadWorkspace,
  checkWorkspaceRole,
} = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

// ================================
// 🚀 CREATE PROJECT (ADMIN + MANAGER)
// ================================
router.post(
  "/",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin", "manager"),
  createProject
);

// ================================
// 📋 GET PROJECTS (ALL MEMBERS)
// ================================
router.get(
  "/:workspaceId",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin", "manager", "member"),
  getProjects
);

module.exports = router;