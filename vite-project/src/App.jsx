import { useState } from "react";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  function handleAddTask() {
    if (inputValue === "") {
      alert("Please write something!");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  }

  return (
    <div>
      <h1>My To Do Board</h1>

      <input
        type="text"
        placeholder="Enter a task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button onClick={handleAddTask}>Add</button>

      {tasks.map((task) => (
        <p key={task.id}>{task.text}</p>
      ))}
    </div>
  );
}

export default TodoApp;
