import { useState } from "react";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [conceptNote, setConceptNote] = useState("");

  function getWhenCategory(dateStr) {
    if (!dateStr) {
      return "longterm";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const taskDate = new Date(dateStr + "T00:00:00");

    if (taskDate.getTime() === today.getTime()) {
      return "today";
    }

    if (taskDate.getTime() === tomorrow.getTime()) {
      return "tomorrow";
    }

    return "longterm";
  }

  function handleAddTask() {
    if (inputValue === "") {
      alert("Please write something!");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
      date: dateValue === "" ? null : dateValue,
      concept: conceptNote === "" ? null : conceptNote,
      status: "todo",
    };

    setTasks([...tasks, newTask]);

    setInputValue("");
    setDateValue("");
    setConceptNote("");
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

      <input
        type="date"
        value={dateValue}
        onChange={(e) => setDateValue(e.target.value)}
      />

      <br />

      <input
        type="text"
        placeholder="Notes / concept (optional)"
        value={conceptNote}
        onChange={(e) => setConceptNote(e.target.value)}
      />

      <button onClick={handleAddTask}>Add</button>

      <div>
        {tasks.map((task) => (
          <div key={task.id}>
            <p>{task.text}</p>

            {task.date && (
              <p>
                Date: {task.date}
              </p>
            )}

            {task.concept && (
              <p>
                Concept: {task.concept}
              </p>
            )}

            <p>
              Category:{" "}
              {getWhenCategory(task.date) === "today"
                ? "Today"
                : getWhenCategory(task.date) === "tomorrow"
                ? "Tomorrow"
                : "Long Term"}
            </p>

            <select
              value={task.status}
              onChange={(e) =>
                handleStatusChange(task.id, e.target.value)
              }
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <button onClick={() => handleDeleteTask(task.id)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;