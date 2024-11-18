import { useState } from "react";
import DropArea from "./DropArea";
import ColumnTask from "./ColumnTask";

export default function ColumnList({
  column,
  tasks,
  onAddTask,
  setTasks,
  draggedTask,
  handleDeleteTask,
  setDraggedTask,
  handleDrop,
  handleDelColumn,
}) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [file, setFile] = useState(null);

  function toggleSplitForm() {
    setShowSplitForm((prev) => !prev);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (taskName) {
      onAddTask(column._id, taskName, description, file);
      setTaskName("");
      setDescription("");
      setFile(null);
      setShowSplitForm(false);
    }
  }

  function handleDragStart(taskId) {
    setDraggedTask(taskId);
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  return (
    <div className="add-form-container">
      <div className="add-form">
        <h4>{column.columnName}</h4>
        <button onClick={() => handleDelColumn(column._id)}>❌</button>
        <button onClick={toggleSplitForm} className="button-add">
          Add Your task
        </button>
        {showSplitForm && (
          <form className="add-form" onSubmit={handleSubmit}>
            <h3>Enter your Task</h3>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="input-field"
            />
            <h3>Enter the task's details</h3>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
            <h3>Attach an image (optional)</h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="input-field"
            />
            <button type="submit" className="button-add">
              Add task
            </button>
          </form>
        )}
      </div>
      <div className="list">
        <ul>
          {draggedTask && <DropArea onDrop={() => handleDrop(column._id, 0)} />}
          {tasks
            .sort((a, b) => a.taskOrder - b.taskOrder)
            .map((task, index) => (
              <div key={task._id}>
                <ColumnTask
                  task={task}
                  setTasks={setTasks}
                  handleDeleteTask={handleDeleteTask}
                  onDragStart={() => handleDragStart(task._id)}
                />
                {draggedTask && (
                  <DropArea onDrop={() => handleDrop(column._id, index + 1)} />
                )}
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}
