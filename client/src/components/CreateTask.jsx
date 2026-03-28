import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { TextField, Button, MenuItem } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function CreateTask({ projectId, refresh }) {
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnId, setColumnId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { darkMode } = useContext(AuthContext);

  // ================================
  // 🔥 FETCH USERS + COLUMNS
  // ================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("/auth/users");
        setUsers(usersRes.data || []);

        const colRes = await API.get(`/columns/${projectId}`);

        if (!colRes.data || colRes.data.length === 0) {
          const newCol = await API.post("/columns", {
            name: "Todo",
            projectId,
          });

          setColumns([newCol.data]);
          setColumnId(newCol.data._id);
        } else {
          setColumns(colRes.data);
          setColumnId(colRes.data[0]._id);
        }

      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, [projectId]);

  // ================================
  // 📝 CREATE TASK (MULTER VERSION)
  // ================================
  const createTask = async () => {
    if (!title.trim()) return alert("Enter task title");

    if (!columnId) {
      alert("❌ Column not ready");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // ✅ REQUIRED FIELDS
      formData.append("title", title.trim());
      formData.append("projectId", projectId);
      formData.append("columnId", columnId);
      formData.append("priority", "medium");

      // ✅ OPTIONAL FIELDS
      if (assignedTo) formData.append("assignedTo", assignedTo);
      if (dueDate) formData.append("dueDate", dueDate);

      // ✅ LABELS (convert to string)
      formData.append(
        "labels",
        JSON.stringify(
          labels ? labels.split(",").map((l) => l.trim()) : []
        )
      );

      // ✅ FILE (MAIN PART)
      if (file) {
        formData.append("file", file);
      }

      console.log("Uploading file:", file);

      await API.post("/tasks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // RESET
      setTitle("");
      setAssignedTo("");
      setDueDate("");
      setLabels("");
      setFile(null);

      refresh();

    } catch (err) {
      console.error("CREATE TASK ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      
      {/* TITLE */}
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
      />

      {/* COLUMN */}
      {columns.length > 0 && (
        <TextField
          select
          label="Column"
          size="small"
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
        >
          {columns.map((col) => (
            <MenuItem key={col._id} value={col._id}>
              {col.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* ASSIGN */}
      {users.length > 0 && (
        <TextField
          select
          label="Assign User"
          size="small"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          {users.map((u) => (
            <MenuItem key={u._id} value={u._id}>
              {u.name || u.email}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* DATE */}
      <TextField
        type="date"
        size="small"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* LABELS */}
      <TextField
        label="Labels"
        size="small"
        value={labels}
        onChange={(e) => setLabels(e.target.value)}
      />

      {/* FILE INPUT */}
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <p style={{ fontSize: "11px" }}>
            📎 {file.name}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <Button onClick={createTask} disabled={loading}>
        {loading ? "Uploading..." : "+ Add Task"}
      </Button>
    </div>
  );
}