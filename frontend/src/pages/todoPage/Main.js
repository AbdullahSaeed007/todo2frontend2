import { useState } from "react";
import CreateList from "../../components/toDoComponents/CreateList";

export default function Main() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  return (
    <CreateList
      columns={columns}
      setColumns={setColumns}
      tasks={tasks}
      setTasks={setTasks}
    />
  );
}
