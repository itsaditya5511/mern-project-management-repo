const router = require("express").Router();

const {
  protect,
  loadWorkspace,
  checkWorkspaceRole,
} = require("../middleware/authMiddleware");

const {
  createWorkspace,
  getMyWorkspaces,
  getMembers,
  inviteMember,
  updateRole,
  removeMember,
} = require("../controllers/workspaceController");

// ================================
// 🏢 CREATE WORKSPACE (ADMIN ONLY)
// ================================
router.post("/", protect, createWorkspace);

// ================================
// 📋 GET MY WORKSPACES (ALL USERS)
// ================================
router.get("/", protect, getMyWorkspaces);

// ================================
// 👥 GET MEMBERS (ALL MEMBERS)
// ================================
router.get(
  "/:id/members",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin", "manager", "member"),
  getMembers
);

// ================================
// ➕ INVITE (ADMIN ONLY)
// ================================
router.post(
  "/:id/invite",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin"),
  inviteMember
);

// ================================
// 🔄 UPDATE ROLE (ADMIN ONLY)
// ================================
router.put(
  "/:id/role",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin"),
  updateRole
);

// ================================
// ❌ REMOVE MEMBER (ADMIN ONLY)
// ================================
router.delete(
  "/:id/member",
  protect,
  loadWorkspace,
  checkWorkspaceRole("admin"),
  removeMember
);

module.exports = router;