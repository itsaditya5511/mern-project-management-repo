import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";

export default function TaskCard({ task, darkMode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: "grab",
  };

  // 🎯 Priority Color Logic (FIXED)
  const getPriorityColor = () => {
    switch (task.priority?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#6b7280";
      default:
        return "#6b7280";
    }
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
        borderRadius: "12px",
        background: darkMode ? "#1e293b" : "#ffffff",
        boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
        marginBottom: "10px",
      }}
    >
      {/* 📝 Title */}
      <h6 style={{ color: darkMode ? "#fff" : "#000" }}>
        {task.title}
      </h6>

      {/* ⚡ Priority */}
      <span
        style={{
          fontSize: "11px",
          padding: "4px 8px",
          borderRadius: "6px",
          background: getPriorityColor(),
          color: "#fff",
          display: "inline-block",
          marginTop: "5px",
        }}
      >
        {task.priority}
      </span>

      {/* 👤 Assigned User */}
      {task.assignedTo && (
        <p style={{ fontSize: "12px", color: "#38bdf8", marginTop: "5px" }}>
          👤 {task.assignedTo.name || task.assignedTo.email}
        </p>
      )}

      {/* 📅 Due Date */}
      {task.dueDate && (
        <p style={{ fontSize: "12px", color: "#f87171" }}>
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* 🏷 Labels */}
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

      {/* 📎 Attachment (ready for multer) */}
      {task.attachment && (
        <p style={{ fontSize: "12px", color: "#22c55e" }}>
          📎 {task.attachment}
        </p>
      )}

      {/* 📝 Activity */}
      {task.activityLogs?.length > 0 && (
        <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "5px" }}>
          📝 {task.activityLogs[task.activityLogs.length - 1].message}
        </p>
      )}
    </motion.div>
  );
}