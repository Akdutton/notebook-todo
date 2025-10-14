const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const categorySelect = document.getElementById("category");
const monthPicker = document.getElementById("monthPicker");
const miniCalendar = document.getElementById("miniCalendar");
const calendarHeader = document.getElementById('calendarHeader');
const clearFilterBtn = document.getElementById('clearFilterBtn');

window.addEventListener("load", loadTasks);
addBtn.addEventListener("click", addTask);

// Render calendar on load
window.addEventListener('load', () => {
  // set monthPicker to current month if empty
  if (!monthPicker.value) {
    const now = new Date();
    monthPicker.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
  }
  renderMiniCalendar();
});

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categorySelect.value;

  if (text === "") return alert("Please enter a task!");

  const task = {
    text,
    dueDate,
    category,
    completed: false,
  };

  renderTask(task);
  saveTask(task);
  taskInput.value = "";
  dueDateInput.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    updateStorage();
  });

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("task-details");

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text;

  const small = document.createElement("small");
  small.textContent = `${task.category}${task.dueDate ? " • Due: " + task.dueDate : ""}`;

  taskDetails.appendChild(textSpan);
  taskDetails.appendChild(small);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.textContent = "✎";
  editBtn.addEventListener("click", () => editTask(task, textSpan));

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateStorage();
  });

  li.appendChild(checkbox);
  li.appendChild(taskDetails);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  renderMiniCalendar();
}

function editTask(task, span) {
  const newText = prompt("Edit your task:", span.textContent);
  if (newText && newText.trim() !== "") {
    span.textContent = newText.trim();
    updateStorage();
  }
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => renderTask(task));
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.querySelector("span").textContent;
    const details = li.querySelector("small").textContent;
    const [category, duePart] = details.split("• Due:");
    const completed = li.classList.contains("completed");
    const task = {
      text,
      category: category.trim(),
      dueDate: duePart ? duePart.trim() : "",
      completed,
    };
    tasks.push(task);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderMiniCalendar();
}

// Filter tasks by selected month
monthPicker.addEventListener("change", () => {
  const selectedMonth = monthPicker.value;
  document.querySelectorAll("#taskList li").forEach((li) => {
    const details = li.querySelector("small").textContent;
    if (details.includes(selectedMonth)) {
      li.style.display = "flex";
    } else if (selectedMonth === "") {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
  renderMiniCalendar();
});

// Mini calendar renderer
function renderMiniCalendar() {
  if (!miniCalendar) return;
  // clear
  miniCalendar.innerHTML = '';

  // headers
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'day header';
    h.textContent = d;
    miniCalendar.appendChild(h);
  });

  // parse selected month
  const [y, m] = (monthPicker.value || '').split('-').map(Number);
  const year = y || new Date().getFullYear();
  const month = (m ? m - 1 : new Date().getMonth());

  // update centered header showing Month Year
  if (calendarHeader) {
    const headerLabel = new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    calendarHeader.textContent = headerLabel;
  }

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // get tasks to highlight
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskDates = new Set(tasks.filter(t => t.dueDate).map(t => t.dueDate));

  // days from previous month (fill blanks)
  for (let i = 0; i < first.getDay(); i++) {
    const cell = document.createElement('div');
    cell.className = 'day inactive';
    cell.textContent = '';
    miniCalendar.appendChild(cell);
  }

  const todayStr = (new Date()).toISOString().slice(0,10);

  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d);
    const iso = date.toISOString().slice(0,10);
    const cell = document.createElement('div');
    cell.className = 'day';
    if (iso === todayStr) cell.classList.add('today');
    if (taskDates.has(iso)) cell.classList.add('has-task');
    cell.textContent = String(d);
    // attach click handler to filter by this date
    cell.addEventListener('click', () => {
      filterTasksByDate(iso);
    });
    miniCalendar.appendChild(cell);
  }
}

function filterTasksByDate(isoDate) {
  // show only tasks that have dueDate matching isoDate
  document.querySelectorAll('#taskList li').forEach(li => {
    const details = li.querySelector('small').textContent;
    if (details.includes(isoDate)) {
      li.style.display = 'flex';
    } else {
      li.style.display = 'none';
    }
  });
  // show clear button
  if (clearFilterBtn) clearFilterBtn.style.display = 'inline-block';
}

if (clearFilterBtn) {
  clearFilterBtn.addEventListener('click', () => {
    document.querySelectorAll('#taskList li').forEach(li => li.style.display = 'flex');
    clearFilterBtn.style.display = 'none';
  });
}

