const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Workspace = require("../models/Workspace");

// ================================
// 🔐 PROTECT ROUTE (AUTH)
// ================================
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

// ================================
// 🏢 LOAD WORKSPACE (FIXED 🔥)
// ================================
exports.loadWorkspace = async (req, res, next) => {
  try {
    const workspaceId =
      req.params.id ||
      req.params.workspaceId ||
      req.body.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    req.workspace = workspace;
    next();

  } catch (err) {
    console.error("LOAD WORKSPACE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// ================================
// 🔥 WORKSPACE ROLE CHECK (CORRECT)
// ================================
exports.checkWorkspaceRole = (...roles) => {
  return (req, res, next) => {
    const member = req.workspace.members.find(
      (m) => m.userId?.toString() === req.user._id.toString()
    );

    if (!member || !roles.includes(member.role)) {
      return res.status(403).json({
        message: "Access denied (workspace role)",
      });
    }

    req.userRole = member.role; // ✅ attach role
    next();
  };
};