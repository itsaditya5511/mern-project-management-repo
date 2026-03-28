import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task }) {
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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="card mb-2 shadow-sm p-2"
      style={style}
    >
      <h6>{task.title}</h6>

      <span
        className={`badge ${
          task.priority === "High"
            ? "bg-danger"
            : task.priority === "Medium"
            ? "bg-warning text-dark"
            : "bg-secondary"
        }`}
      >
        {task.priority}
      </span>
    </div>
  );
}