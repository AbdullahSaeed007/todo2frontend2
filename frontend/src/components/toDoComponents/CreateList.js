import { useState, useEffect } from "react";
import axios from "axios";
import ColumnList from "./ColumnList";

export default function CreateList({
  columns = [],
  setColumns,
  tasks = [],
  setTasks,
}) {
  const [columnName, setColumnName] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);

  // useEffect(() => {
  //   console.log("Current tasks:", tasks);
  // }, [tasks]);

  async function handleAddTask(colId, taskName, description, file) {
    if (!taskName) return;
    try {
      const formData = new FormData();
      formData.append("taskName", taskName);
      formData.append("taskDescription", description);
      formData.append("colId", colId);
      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post(
        "http://localhost:9000/api/v1/task/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newTask = {
          ...response.data.task,
          columnId: colId,
        };
        setTasks((prev) => [...prev, newTask]);
      } else {
        console.error("Failed to create task:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  }

  async function handleDeleteTask(taskId) {
    if (!taskId) return;
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/v1/task/delete/${taskId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      } else {
        console.error("Failed to delete task:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  }

  async function handleAddColumn() {
    if (!columnName) return;
    try {
      const response = await axios.post(
        "http://localhost:9000/api/v1/column/post",
        { columnName },
        { withCredentials: true }
      );

      if (response.data.success) {
        setColumns((prev) => [...prev, response.data.column]);
        setColumnName("");
      } else {
        console.error("Failed to create column:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding column:", error.message);
    }
  }

  async function handleDelColumn(colId) {
    if (!colId) return;
    try {
      const response = await axios.delete(
        `http://localhost:9000/api/v1/column/delete/${colId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setColumns((prevCols) => prevCols.filter((col) => col._id !== colId));
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.colId !== colId)
        );
      } else {
        console.error("Failed to delete column:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting column:", error.message);
    }
  }

  useEffect(() => {
    async function fetchColumnsAndTasks() {
      try {
        const columnsResponse = await axios.get(
          "http://localhost:9000/api/v1/column",
          {
            withCredentials: true,
          }
        );
        const tasksResponse = await axios.get(
          "http://localhost:9000/api/v1/task/get",
          {
            withCredentials: true,
          }
        );

        if (columnsResponse.data.success && tasksResponse.data.success) {
          setColumns(columnsResponse.data.columns);

          const flattenedTasks = tasksResponse.data.tasksByColumn.flatMap(
            (col) =>
              col.tasks.map((task) => ({
                ...task,
                columnId: col.columnId,
              }))
          );

          setTasks(flattenedTasks);
        } else {
          console.error("Failed to fetch columns or tasks");
        }
      } catch (error) {
        console.error("Error fetching columns or tasks:", error);
      }
    }

    fetchColumnsAndTasks();
  }, [setColumns, setTasks]);

  function handleDrop(targetCol, newOrder) {
    const taskToMove = tasks.find((task) => task._id === draggedTask);
    if (
      !taskToMove ||
      (taskToMove.colId === targetCol && taskToMove.taskOrder === newOrder)
    ) {
      return;
    }

    async function updateTaskOrder() {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/v1/task/drag/event",
          {
            taskToMoveId: draggedTask,
            targetColumn: targetCol,
            targetOrder: newOrder,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          const updatedTasksByColumn = response.data.tasksByColumn;

          const flattenedTasks = updatedTasksByColumn.flatMap((col) =>
            col.tasks.map((task) => ({
              ...task,
              columnId: col.columnId,
            }))
          );

          setTasks(flattenedTasks);
          console.log("hello from dnd", response.data.tasksByColumn);
        } else {
          console.error("Failed to reorder tasks:", response.data.message);
        }
      } catch (error) {
        console.error("Error updating task order:", error.message);
      }
    }

    updateTaskOrder();
    setDraggedTask(null);
  }

  return (
    <div>
      <div className="column-list">
        {columns.map((column) => (
          <ColumnList
            key={column._id}
            column={column}
            tasks={tasks.filter((task) => task.columnId === column._id)}
            onAddTask={handleAddTask}
            handleDeleteTask={handleDeleteTask}
            setTasks={setTasks}
            draggedTask={draggedTask}
            setDraggedTask={setDraggedTask}
            handleDrop={handleDrop}
            handleDelColumn={handleDelColumn}
          />
        ))}
      </div>
      <div className="container">
        <h3>Column Name: </h3>
        <input
          type="text"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          className="input-field"
        />
        <button onClick={handleAddColumn} className="button-add">
          Add a new Column +
        </button>
      </div>
    </div>
  );
}
