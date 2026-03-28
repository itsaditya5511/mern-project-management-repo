const Column = require("../models/Column");

// ================================
// ➕ CREATE COLUMN
// ================================
exports.createColumn = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    const column = await Column.create({
      name,
      projectId,
    });

    res.status(201).json(column);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 📥 GET COLUMNS BY PROJECT
// ================================
exports.getColumns = async (req, res) => {
  try {
    const columns = await Column.find({
      projectId: req.params.projectId,
    }).sort({ order: 1 });

    res.json(columns);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// ✏️ RENAME COLUMN
// ================================
exports.renameColumn = async (req, res) => {
  try {
    const { name } = req.body;

    const column = await Column.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    res.json(column);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// ❌ DELETE COLUMN
// ================================
exports.deleteColumn = async (req, res) => {
  try {
    await Column.findByIdAndDelete(req.params.id);

    res.json({ message: "Column deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};