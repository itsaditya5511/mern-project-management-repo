const Workspace = require("../models/Workspace");
const User = require("../models/User");

// ================================
// 🥇 CREATE WORKSPACE
// ================================
exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [
        {
          userId: req.user._id,
          email: req.user.email,
          role: "admin",
        },
      ],
    });

    res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });

  } catch (err) {
    console.error("CREATE WORKSPACE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 🥈 GET MY WORKSPACES (🔥 FIXED)
// ================================
exports.getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { "members.userId": req.user._id },
        { "members.email": req.user.email }
      ]
    }).populate("members.userId", "name email");

    // 🔥 AUTO LINK EMAIL → USER ID
    for (let workspace of workspaces) {
      let updated = false;

      workspace.members.forEach((m) => {
        if (!m.userId && m.email === req.user.email) {
          m.userId = req.user._id;
          updated = true;
        }
      });

      if (updated) await workspace.save();
    }

    res.json(workspaces);

  } catch (err) {
    console.error("GET WORKSPACES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 📥 GET MEMBERS
// ================================
exports.getMembers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("members.userId", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace.members);

  } catch (err) {
    console.error("GET MEMBERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 🥉 INVITE MEMBER
// ================================
exports.inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.id;

    if (!workspaceId || !email) {
      return res.status(400).json({
        message: "Workspace ID and Email are required",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // ✅ check admin
    const currentUser = workspace.members.find(
      (m) => m.userId?.toString() === req.user._id.toString()
    );

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can invite members",
      });
    }

    // ❌ prevent duplicate
    const alreadyMember = workspace.members.find(
      (m) => m.email === email
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already invited",
      });
    }

    // 🔍 check if user exists
    const user = await User.findOne({ email });

    workspace.members.push({
      userId: user ? user._id : null,
      email,
      role: role || "member",
    });

    await workspace.save();

    res.json({
      message: "Member invited successfully",
      workspace,
    });

  } catch (err) {
    console.error("INVITE MEMBER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 🔄 UPDATE ROLE
// ================================
exports.updateRole = async (req, res) => {
  try {
    const { memberId, role } = req.body;
    const workspaceId = req.params.id;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // ✅ only admin
    const currentUser = workspace.members.find(
      (m) => m.userId?.toString() === req.user._id.toString()
    );

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update roles",
      });
    }

    const member = workspace.members.find(
      (m) => m.userId?.toString() === memberId
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;

    await workspace.save();

    res.json({ message: "Role updated successfully" });

  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 🏅 REMOVE MEMBER
// ================================
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const workspaceId = req.params.id;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // ✅ only admin
    const currentUser = workspace.members.find(
      (m) => m.userId?.toString() === req.user._id.toString()
    );

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can remove members",
      });
    }

    workspace.members = workspace.members.filter(
      (m) => m.userId?.toString() !== memberId
    );

    await workspace.save();

    res.json({
      message: "Member removed successfully",
      workspace,
    });

  } catch (err) {
    console.error("REMOVE MEMBER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};