import { useState } from "react";
import "./App.css";
import { Calendar, FileText } from "lucide-react";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [filterType, setFilterType] = useState("all");

  function getWhenCategory(date) {
    if (!date) return "longterm";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const taskDate = new Date(date + "T00:00:00");

    if (taskDate.getTime() === today.getTime()) return "today";
    if (taskDate.getTime() === tomorrow.getTime()) return "tomorrow";
    if (taskDate < today) return "overdue";

    return "longterm";
  }

  function getWhenLabel(task) {
    const category = getWhenCategory(task.date);

    if (task.status === "done") {
      return category === "overdue" ? "Completed Late" : "Completed";
    }

    if (category === "today") return "Today";
    if (category === "tomorrow") return "Tomorrow";
    if (category === "overdue") return "Overdue";

    return "Long Term";
  }

  function getBadgeClass(task) {
    const category = getWhenCategory(task.date);

    if (task.status === "done") {
      return category === "overdue"
        ? "task-badge badge-completed-late"
        : "task-badge badge-completed";
    }

    if (category === "overdue") return "task-badge badge-overdue";
    if (category === "longterm") return "task-badge badge-longterm";

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
      note: noteValue === "" ? null : noteValue,
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
    setDateValue("");
    setNoteValue("");
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleStatusChange(id, status) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  const columns = [
    { key: "todo", label: "To Do" },
    { key: "inprogress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  function getTasksForColumn(columnKey) {
    return tasks.filter((task) => {
      if (task.status !== columnKey) return false;

      if (filterType === "all") return true;

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
            title="Pick a date"
            className="date-input"
          />

          <br />

          <input
            type="text"
            placeholder="Note / description (optional)"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            className="note-input"
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
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key)}
              className={
                filterType === filter.key
                  ? "filter-button filter-button-active"
                  : "filter-button"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="board">
          {columns
            .filter(
              (column) =>
                !(filterType === "overdue" && column.key === "done")
            )
            .map((column) => {
              const columnTasks = getTasksForColumn(column.key);

              return (
                <div key={column.key} className="column">
                  <h2 className="column-heading">{column.label}</h2>

                  {columnTasks.length === 0 && (
                    <p className="empty-text">Nothing here</p>
                  )}

                  {columnTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <span className={getBadgeClass(task)}>
                        {getWhenLabel(task)}
                      </span>

                      <p className="task-text">{task.text}</p>

                      {task.date && (
                        <p className="task-note">
                          <Calendar size={16} /> {task.date}
                        </p>
                      )}

                      {task.note && (
                        <p className="task-note">
                          <FileText size={16} /> {task.note}
                        </p>
                      )}
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
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
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default TodoApp;