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
      status: "todo",              
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  }

  function handleDeleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function handleStatusChange(id, newStatus) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(newTasks);
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

      <div>
        {tasks.map((task) => (
          <div key={task.id}>                       
            <p>{task.text}</p>
            <select                                 
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button onClick={() => handleDeleteTask(task.id)}>X</button>  
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;