import { useState } from "react";
import "./TodoApp.css";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [filterType, setFilterType] = useState("all"); 
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

  function isOverdue(task) {
    if (!task.date || task.status === "done") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date + "T00:00:00");

    return taskDate.getTime() < today.getTime();
  }

  function whenLabel(task) {
    if (task.status === "done") {
      return "Completed";
    }

    if (isOverdue(task)) {
      return "Overdue";
    }

    const category = getWhenCategory(task.date);
    if (category === "today") return "Today";
    if (category === "tomorrow") return "Tomorrow";
    return "Long Term";
  }

  function badgeClass(task) {
    if (task.status === "done") {
      return "task-badge badge-completed";
    }

    if (isOverdue(task)) {
      return "task-badge badge-overdue";
    }

    const category = getWhenCategory(task.date);
    if (category === "longterm") {
      return "task-badge badge-longterm";
    }
    return "task-badge badge-today";
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
      status: "todo", 
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
    setDateValue("");
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
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

  const columns = [
    { key: "todo", label: "To Do" },
    { key: "inprogress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  function getTasksForColumn(columnKey) {
    return tasks.filter((task) => {
      if (task.status !== columnKey) {
        return false;
      }
      if (filterType === "all") {
        return true;
      }
      if (filterType === "overdue") {
        return isOverdue(task);
      }
      return getWhenCategory(task.date) === filterType;
    });
  }

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="app-heading">My To Do Board</h1>

        <div className="input-row">
          <input
            type="text"
            placeholder="Enter a task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="task-input"
          />

          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            title="Pick a date (leave empty for Long Term)"
            className="date-input"
          />

          <button onClick={handleAddTask} className="add-button">
            Add
          </button>
        </div>

        <div className="filter-row">
          {[
            { key: "all", label: "All Tasks" },
            { key: "today", label: "Today" },
            { key: "longterm", label: "Long Term" },
            { key: "overdue", label: "Overdue" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={
                filterType === f.key
                  ? "filter-button filter-button-active"
                  : "filter-button"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="board">
          {columns
            .filter((column) => !(filterType === "overdue" && column.key === "done"))
            .map((column) => (
              <div key={column.key} className="column">
                <h2 className="column-heading">{column.label}</h2>

                {getTasksForColumn(column.key).length === 0 && (
                  <p className="empty-text">Nothing here</p>
                )}

                {getTasksForColumn(column.key).map((task) => (
                  <div key={task.id} className="task-card">
                    <span className={badgeClass(task)}>{whenLabel(task)}</span>

                    <p className="task-text">{task.text}</p>

                    {task.date && <p className="task-note">📅 {task.date}</p>}

                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default TodoApp;