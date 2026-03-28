const express = require("express");
const router = express.Router();

const { register, login, getAllUsers } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ================================
// 🔓 PUBLIC ROUTES
// ================================
router.post("/register", register);
router.post("/login", login);

// ================================
// 🔐 PROTECTED ROUTES
// ================================

// ✅ Get logged-in user
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

// ✅ GET ALL USERS (🔥 IMPORTANT for assignment dropdown)
router.get("/users", protect, getAllUsers);

module.exports = router;