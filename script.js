const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTaskToDOM(task.text, task.completed, task.dueDate));
};
setInterval(checkReminders, 60000); // check every 1 minute

function checkReminders() {
  const now = new Date();
  document.querySelectorAll("#taskList li").forEach(li => {
    const span = li.querySelector("span");
    const match = span.textContent.match(/- Due: (\d{4}-\d{2}-\d{2})/);

    if (match) {
      const dueDateStr = match[1];
      const dueDate = new Date(dueDateStr);
      const timeDiff = dueDate - now;

      const minutesBefore = 10; // notify if due in next 10 minutes
      if (timeDiff > 0 && timeDiff <= minutesBefore * 60 * 1000) {
        const taskText = span.textContent.split(" - Due:")[0];
        sendReminder(taskText, dueDateStr);
      }
    }
  });
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const span = li.querySelector("span");
    const fullText = span.textContent;
    const match = fullText.match(/(.*?) - Due: (.*)/);
    const text = match ? match[1].trim() : fullText.trim();
    const dueDate = match ? match[2].trim() : "";
    const completed = li.classList.contains("completed");
    tasks.push({ text, completed, dueDate });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = taskDate.value;
  if (!text) return;
  addTaskToDOM(text, false, dueDate);
  taskInput.value = "";
  taskDate.value = "";
  saveTasks();
}

function addTaskToDOM(text, completed, dueDate) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = `${text}${dueDate ? " - Due: " + dueDate : ""}`;
  li.appendChild(span);

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✓";
  completeBtn.classList.add("complete", "btn");
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
  };
  if (dueDate) {
  const countdown = document.createElement("span");
  countdown.classList.add("countdown");
  li.appendChild(countdown);

  const updateCountdown = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff <= 0) {
      countdown.textContent = " ⏰ Due!";
      countdown.classList.add("overdue");
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      countdown.textContent = ` ⏳ ${days}d ${hours}h ${minutes}m`;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 60000); // update every minute
}


  const editBtn = document.createElement("button");
  editBtn.textContent = "✎";
  editBtn.classList.add("edit", "btn");
  editBtn.onclick = () => {
    const newText = prompt("Edit your task:", text);
    if (newText !== null && newText.trim() !== "") {
      span.textContent = `${newText}${dueDate ? " - Due: " + dueDate : ""}`;
      saveTasks();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.classList.add("delete", "btn");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  if (completed) {
    li.classList.add("completed");
  }

  document.getElementById("taskList").appendChild(li);
}
function filterTasks(filter) {
  const tasks = document.querySelectorAll("#taskList li");

  tasks.forEach(task => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "completed":
        task.classList.contains("completed")
          ? (task.style.display = "flex")
          : (task.style.display = "none");
        break;
      case "pending":
        task.classList.contains("completed")
          ? (task.style.display = "none")
          : (task.style.display = "flex");
        break;
    }
  });
}


function editTask(span, oldText, oldDate) {
  const li = span.parentElement;
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = oldDate || "";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾";
  saveBtn.onclick = () => {
    const newText = input.value.trim();
    const newDate = dateInput.value;
    if (!newText) return;
    span.textContent = `${newText}${newDate ? " - Due: " + newDate : ""}`;
    li.replaceChild(span, input);
    li.removeChild(dateInput);
    li.replaceChild(editBtn, saveBtn);
    saveTasks();
  };

  const editBtn = li.querySelector("button:nth-child(3)");

  li.replaceChild(input, span);
  li.insertBefore(dateInput, editBtn);
  li.replaceChild(saveBtn, editBtn);
}
const themeToggle = document.getElementById("themeToggle");
const modeLabel = document.getElementById("modeLabel");

// Load theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
    modeLabel.textContent = "☀️ Light Mode";
  }
});

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  modeLabel.textContent = isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
});
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
function sendReminder(taskText, dueDate) {
  if (Notification.permission === "granted") {
    new Notification("⏰ Task Reminder", {
      body: `"${taskText}" is due on ${dueDate}!`,
    });
  }
}
