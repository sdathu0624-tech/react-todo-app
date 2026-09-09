import { useState } from "react";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [conceptNote, setConceptNote] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | today | tomorrow | longterm
  const [isAddHovered, setIsAddHovered] = useState(false);
  const [isAddPressed, setIsAddPressed] = useState(false);

  // Figures out if a date is Today, Tomorrow, or Long Term
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

  // A task is overdue if its date has already passed and it's not marked Done
  function isOverdue(task) {
    if (!task.date) return false;
    if (task.status === "done") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date + "T00:00:00");

    return taskDate.getTime() < today.getTime();
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
      status: "todo", // todo | inprogress | done
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
    setDateValue("");
    setConceptNote("");
  }

  function handleDeleteTask(id) {
    const taskToDelete = tasks.find((task) => task.id === id);
    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks);
    setDeletedTasks([...deletedTasks, taskToDelete]);
  }

  function handleRestoreTask(id) {
    const taskToRestore = deletedTasks.find((task) => task.id === id);
    const newDeletedTasks = deletedTasks.filter((task) => task.id !== id);

    setDeletedTasks(newDeletedTasks);
    setTasks([...tasks, taskToRestore]);
  }

  function handlePermanentDelete(id) {
    const newDeletedTasks = deletedTasks.filter((task) => task.id !== id);
    setDeletedTasks(newDeletedTasks);
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

  function handleDateChange(id, newDate) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, date: newDate === "" ? null : newDate };
      }
      return task;
    });
    setTasks(newTasks);
  }

  const columns = [
    { key: "todo", label: "To Do", color: "#dbe6f5" },
    { key: "inprogress", label: "In Progress", color: "#dbe6f5" },
    { key: "done", label: "Done", color: "#dbe6f5" },
  ];

  // A task counts as completed late if it was finished after its date had passed
  function wasCompletedLate(task) {
    if (task.status !== "done") return false;
    if (!task.date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date + "T00:00:00");

    return taskDate.getTime() < today.getTime();
  }

  function statusColor(status) {
    if (status === "todo") return "#8a8a8a";
    if (status === "inprogress") return "#e08e0b";
    if (status === "done") return "#2e8b57";
    return "#8a8a8a";
  }

  function statusLabel(status) {
    if (status === "todo") return "To Do";
    if (status === "inprogress") return "In Progress";
    if (status === "done") return "Done";
    return status;
  }

  function whenLabel(task) {
    if (task.status === "done") {
      return wasCompletedLate(task) ? "Completed Late" : "Completed";
    }
    if (isOverdue(task)) return "Overdue";
    const category = getWhenCategory(task.date);
    if (category === "today") return "Today";
    if (category === "tomorrow") return "Tomorrow";
    return "Long Term";
  }

  return (
    <div
      style={{
        fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(#1a3a6b, #0d2140)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#dbe6f5",
            fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
            fontStyle: "italic",
            fontSize: "40px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          My To Do Board
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter a task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              padding: "8px",
              width: "45%",
              fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
              border: "1px solid #1a3a6b",
              borderRadius: "4px",
            }}
          />

          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            title="Pick a date (leave empty for Long Term)"
            style={{
              padding: "8px",
              marginLeft: "5px",
              fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
              border: "1px solid #1a3a6b",
              borderRadius: "4px",
              background: "#dbe6f5",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Notes / concept (optional)"
            value={conceptNote}
            onChange={(e) => setConceptNote(e.target.value)}
            style={{
              padding: "8px",
              width: "45%",
              marginTop: "8px",
              fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
              border: "1px solid #1a3a6b",
              borderRadius: "4px",
            }}
          />

          <button
            onClick={handleAddTask}
            onMouseEnter={() => setIsAddHovered(true)}
            onMouseLeave={() => {
              setIsAddHovered(false);
              setIsAddPressed(false);
            }}
            onMouseDown={() => setIsAddPressed(true)}
            onMouseUp={() => setIsAddPressed(false)}
            style={{
              padding: "8px 16px",
              marginLeft: "5px",
              marginTop: "8px",
              background: isAddPressed
                ? "#9fb8db"
                : isAddHovered
                  ? "#c3d7f0"
                  : "#dbe6f5",
              color: "#1c3d7a",
              fontWeight: "bold",
              border: "2px solid #ffffff",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
              transform: isAddPressed
                ? "scale(0.97)"
                : isAddHovered
                  ? "scale(1.05)"
                  : "scale(1)",
              transition: "all 0.15s ease",
            }}
          >
            Add
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          {[
            { key: "all", label: "All Tasks" },
            { key: "today", label: "Today" },
            { key: "tomorrow", label: "Tomorrow" },
            { key: "longterm", label: "Long Term" },
            { key: "overdue", label: "Overdue" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              style={{
                padding: "6px 14px",
                margin: "0 5px",
                background: filterType === f.key ? "#dbe6f5" : "transparent",
                color: filterType === f.key ? "#1c3d7a" : "#dbe6f5",
                border: "1px solid #dbe6f5",
                borderRadius: "20px",
                cursor: "pointer",
                fontFamily: "'Comic Sans MS', 'Trebuchet MS', sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {columns
            .filter(
              (column) => !(filterType === "overdue" && column.key === "done"),
            )
            .map((column) => (
              <div
                key={column.key}
                style={{
                  background: column.color,
                  borderRadius: "10px",
                  padding: "15px",
                  width: "220px",
                  maxHeight: "55vh",
                  overflowY: "auto",
                }}
              >
                <h2 style={{ color: "#1c3d7a", fontSize: "18px" }}>
                  {column.label}
                </h2>

                {tasks.filter(
                  (task) =>
                    task.status === column.key &&
                    (filterType === "all" ||
                      (filterType === "overdue" && isOverdue(task)) ||
                      getWhenCategory(task.date) === filterType),
                ).length === 0 && (
                  <p style={{ color: "#5a7ab0", fontSize: "14px" }}>
                    Nothing here
                  </p>
                )}

                {tasks
                  .filter(
                    (task) =>
                      task.status === column.key &&
                      (filterType === "all" ||
                        (filterType === "overdue" && isOverdue(task)) ||
                        getWhenCategory(task.date) === filterType),
                  )
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: "#ffffff",
                        margin: "8px 0",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #a9c1e0",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          marginBottom: "6px",
                          background:
                            task.status === "done"
                              ? wasCompletedLate(task)
                                ? "#e08e0b"
                                : "#2e8b57"
                              : isOverdue(task)
                                ? "#c0392b"
                                : getWhenCategory(task.date) === "longterm"
                                  ? "#1a3a6b"
                                  : "#a9c1e0",
                          color:
                            task.status === "done"
                              ? "white"
                              : isOverdue(task)
                                ? "white"
                                : getWhenCategory(task.date) === "longterm"
                                  ? "white"
                                  : "#1c3d7a",
                        }}
                      >
                        {whenLabel(task)}
                      </span>

                      <p style={{ margin: "4px 0 8px 0", color: "#1c3d7a" }}>
                        {task.text}
                      </p>

                      <div style={{ margin: "4px 0" }}>
                        <input
                          type="date"
                          value={task.date || ""}
                          onChange={(e) =>
                            handleDateChange(task.id, e.target.value)
                          }
                          style={{
                            fontSize: "12px",
                            padding: "2px 4px",
                            fontFamily:
                              "'Comic Sans MS', 'Trebuchet MS', sans-serif",
                            border: "1px solid #a9c1e0",
                            borderRadius: "3px",
                            background: "#eaf2ff",
                          }}
                        />
                      </div>

                      {task.concept && (
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            color: "#5a7ab0",
                            fontSize: "13px",
                          }}
                        >
                          💡 {task.concept}
                        </p>
                      )}

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        style={{
                          marginRight: "5px",
                          fontFamily:
                            "'Comic Sans MS', 'Trebuchet MS', sans-serif",
                        }}
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{
                          background: "#1a3a6b",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
              </div>
            ))}

          <div
            style={{
              background: "#dbe6f5",
              borderRadius: "10px",
              padding: "15px",
              width: "220px",
              maxHeight: "55vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ color: "#1c3d7a", fontSize: "18px" }}>Trash</h2>

            {deletedTasks.length === 0 && (
              <p style={{ color: "#5a7ab0", fontSize: "14px" }}>
                Nothing here
              </p>
            )}

            {deletedTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: "#ffffff",
                  margin: "8px 0",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #a9c1e0",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    marginBottom: "6px",
                    background:
                      task.status === "done"
                        ? wasCompletedLate(task)
                          ? "#e08e0b"
                          : "#2e8b57"
                        : isOverdue(task)
                          ? "#c0392b"
                          : getWhenCategory(task.date) === "longterm"
                            ? "#1a3a6b"
                            : "#a9c1e0",
                    color:
                      task.status === "done"
                        ? "white"
                        : isOverdue(task)
                          ? "white"
                          : getWhenCategory(task.date) === "longterm"
                            ? "white"
                            : "#1c3d7a",
                  }}
                >
                  {whenLabel(task)}
                </span>

                <p style={{ margin: "4px 0 8px 0", color: "#1c3d7a" }}>
                  {task.text}
                </p>

                {task.date && (
                  <p style={{ margin: "0 0 4px 0", color: "#5a7ab0", fontSize: "13px" }}>
                    📅 {task.date}
                  </p>
                )}

                {task.concept && (
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#5a7ab0",
                      fontSize: "13px",
                    }}
                  >
                    💡 {task.concept}
                  </p>
                )}

                <button
                  onClick={() => handleRestoreTask(task.id)}
                  style={{
                    background: "#2e8b57",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  Restore
                </button>

                <button
                  onClick={() => handlePermanentDelete(task.id)}
                  style={{
                    background: "#1a3a6b",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
