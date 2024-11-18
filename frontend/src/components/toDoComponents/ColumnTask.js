import { useState } from "react";
export default function ColumnTask({
  task,
  onDragStart,
  onDrop,
  setTasks,
  handleDeleteTask,
}) {
  const [check, setCheck] = useState(false);
  function toggleCheckbox(taskId) {
    check===false?setCheck(true):setCheck(false);
    // setTasks((prevTasks) => {
    //   const updatedTasks = prevTasks.map((t) =>
    //     t.id === taskId ? { ...t, check: !t.check } : t
    //   );
    //   localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    //   return updatedTasks;
    // });
    console.log("checkBox");
  }

  return (
    <div
      className="task-item"
      draggable="true"
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <span className={`task-details ${check ? "completed" : ""}`}>
        <input
          type="checkbox"
          checked={check}
          onChange={() => toggleCheckbox(task._id)}
        />
        <span className="task-info">
          <strong>{task.taskName}</strong> {" | "} {task.taskDescription}
        </span>
      </span>

      {/* Display the image if it exists */}
      {task.image && (
        <div className="task-image">
          <img src={`http://localhost:9000${task.image}`} alt={task.taskName} />
        </div>
      )}

      <button
        onClick={() => handleDeleteTask(task._id)}
        className="button-delete"
      >
        ❌
      </button>
    </div>
  );
}
