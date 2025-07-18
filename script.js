const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTaskToDOM(task.text, task.completed));
};

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  addTaskToDOM(taskText, false);
  taskInput.value = "";
  saveTasks();
}

function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <button class="complete">✔️</button>
    <button class="delete">🗑️</button>
  `;
  if (completed) li.classList.add("completed");

  li.querySelector(".complete").onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
  };

  li.querySelector(".delete").onclick = () => {
    li.remove();
    saveTasks();
  };

  taskList.appendChild(li);
}
