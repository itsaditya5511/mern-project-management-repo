import { useEffect, useState, useContext, useCallback } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateTask from "../components/CreateTask";
import { AuthContext } from "../context/AuthContext";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import socket from "../services/socket";

// ================================
// 🔥 TASK ITEM
// ================================
function TaskItem({ task, darkMode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: "grab",
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }}
      style={{
        ...style,
        padding: "12px",
        borderRadius: "10px",
        background: darkMode ? "#1e293b" : "#ffffff",
        boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
        marginBottom: "10px",
      }}
    >
      <h6 style={{ color: darkMode ? "#fff" : "#000" }}>
        {task.title}
      </h6>

      {task.priority && (
        <span
          style={{
            fontSize: "11px",
            padding: "3px 6px",
            borderRadius: "6px",
            background:
              task.priority === "high"
                ? "#ef4444"
                : task.priority === "medium"
                ? "#f59e0b"
                : "#6b7280",
            color: "#fff",
          }}
        >
          {task.priority}
        </span>
      )}

      {task.assignedTo && (
        <p style={{ fontSize: "12px", color: "#38bdf8", marginTop: "5px" }}>
          👤 {task.assignedTo.name || task.assignedTo.email}
        </p>
      )}

      {task.dueDate && (
        <p style={{ fontSize: "12px", color: "#f87171" }}>
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div style={{ marginTop: "5px" }}>
        {task.labels?.map((label, i) => (
          <span
            key={i}
            style={{
              fontSize: "10px",
              background: "#6366f1",
              color: "#fff",
              padding: "3px 6px",
              borderRadius: "6px",
              marginRight: "4px",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {task.attachment && (
        <p style={{ fontSize: "12px", color: "#22c55e" }}>
          📎 {task.attachment}
        </p>
      )}

      {task.activityLogs?.length > 0 && (
        <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "5px" }}>
          📝 {task.activityLogs[task.activityLogs.length - 1].message}
        </p>
      )}
    </motion.div>
  );
}

// ================================
// 🔥 COLUMN
// ================================
function Column({ column, tasks, darkMode }) {
  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: "280px",
        borderRadius: "12px",
        padding: "10px",
        background: darkMode ? "#0f172a" : "#e2e8f0",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          padding: "10px",
          borderRadius: "8px",
          background: "#6366f1",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {column.name}
      </div>

      <div style={{ minHeight: "400px" }}>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
}

// ================================
// 🔥 MAIN
// ================================
export default function KanbanBoard() {
  const { id } = useParams();
  const { darkMode } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newColumn, setNewColumn] = useState("");

  const fetchTasks = useCallback(async () => {
    const res = await API.get(`/tasks/${id}`);
    setTasks(res.data);
  }, [id]);

  const fetchColumns = useCallback(async () => {
    const res = await API.get(`/columns/${id}`);

    if (!res.data || res.data.length === 0) {
      const newCol = await API.post("/columns", {
        name: "Todo",
        projectId: id,
      });

      setColumns([newCol.data]);
    } else {
      setColumns(res.data);
    }
  }, [id]);

  useEffect(() => {
    fetchTasks();
    fetchColumns();

    socket.on("taskUpdated", fetchTasks);

    return () => {
      socket.off("taskUpdated", fetchTasks);
    };
  }, [fetchTasks, fetchColumns]); // ✅ clean

  const createColumn = async () => {
    if (!newColumn) return;

    await API.post("/columns", {
      name: newColumn,
      projectId: id,
    });

    setNewColumn("");
    fetchColumns();
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;

    try {
      await API.put(`/tasks/${active.id}/move`, {
        columnId: over.id,
      });

      socket.emit("taskMoved", {
        taskId: active.id,
        columnId: over.id,
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <CreateTask projectId={id} refresh={fetchTasks} />

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input
              placeholder="New column..."
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px" }}
            />
            <button onClick={createColumn}>+ Add Column</button>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            <div
              style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                marginTop: "20px",
              }}
            >
              {columns.map((col) => (
                <Column
                  key={col._id}
                  column={col}
                  tasks={tasks.filter(
                    (t) =>
                      (t.columnId?._id || t.columnId) === col._id
                  )}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}