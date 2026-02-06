const storageKey = "premium.todo.data";
const themeKey = "premium.todo.theme";

const appShell = document.querySelector(".app-shell");
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskDue = document.getElementById("taskDue");
const taskTags = document.getElementById("taskTags");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const summaryText = document.getElementById("summaryText");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const overdueCount = document.getElementById("overdueCount");
const streakCount = document.getElementById("streakCount");
const chartBars = document.getElementById("chartBars");
const statusFilters = document.getElementById("statusFilters");
const priorityFilters = document.getElementById("priorityFilters");
const categoryFilters = document.getElementById("categoryFilters");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");
const undoSnackbar = document.getElementById("undoSnackbar");
const undoDelete = document.getElementById("undoDelete");
const themeToggle = document.getElementById("themeToggle");
const priorityButtons = document.querySelectorAll(".segmented-btn");

let tasks = [];
let categories = ["Work", "Personal", "Wellbeing", "Finance"];
let filters = {
  status: "all",
  priority: "all",
  category: "all",
  search: "",
};
let selectedTaskId = null;
let selectedCategoryId = null;
let lastDeleted = null;
let undoTimer = null;
let dragTaskId = null;
let duplicateOnDrop = false;

const priorityPalette = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const weekTemplate = [3, 5, 4, 2, 6, 3, 4];

const loadState = () => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    tasks = parsed.tasks || [];
    categories = parsed.categories || categories;
  }
};

const saveState = () => {
  localStorage.setItem(storageKey, JSON.stringify({ tasks, categories }));
};

const loadTheme = () => {
  const saved = localStorage.getItem(themeKey);
  if (saved) {
    appShell.dataset.theme = saved;
    themeToggle.textContent = saved === "dark" ? "Dark" : "Light";
    themeToggle.setAttribute("aria-pressed", saved === "dark");
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  appShell.dataset.theme = prefersDark ? "dark" : "light";
  themeToggle.textContent = prefersDark ? "Dark" : "Light";
  themeToggle.setAttribute("aria-pressed", prefersDark);
};

const setPriority = (value) => {
  priorityButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.priority === value);
  });
};

const formatDateLabel = (dateString) => {
  if (!dateString) return "No due date";
  const date = new Date(dateString + "T00:00:00");
  const now = new Date();
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `Due in ${diff}d`;
};

const buildCategoryFilters = () => {
  categoryFilters.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "pill";
  allBtn.dataset.category = "all";
  allBtn.type = "button";
  allBtn.textContent = "All";
  if (filters.category === "all") allBtn.classList.add("is-active");
  categoryFilters.appendChild(allBtn);
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "pill";
    btn.dataset.category = cat;
    btn.type = "button";
    btn.textContent = cat;
    if (filters.category === cat) btn.classList.add("is-active");
    categoryFilters.appendChild(btn);
  });
};

const buildCategoryPanel = () => {
  categoryList.innerHTML = "";
  categories.forEach((cat, index) => {
    const item = document.createElement("div");
    item.className = "category-item";
    item.setAttribute("draggable", "true");
    item.dataset.index = index;
    item.innerHTML = `<span>${cat}</span><small>${countTasksByCategory(cat)}</small>`;
    if (selectedCategoryId === index) item.classList.add("is-selected");
    categoryList.appendChild(item);
  });
};

const buildChart = () => {
  chartBars.innerHTML = "";
  weekTemplate.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    const height = Math.min(100, value * 12 + index * 2);
    bar.style.height = `${height}%`;
    chartBars.appendChild(bar);
  });
};

const countTasksByCategory = (category) =>
  tasks.filter((task) => task.category === category).length;

const updateStats = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const overdue = tasks.filter((task) => isOverdue(task)).length;
  totalCount.textContent = total;
  completedCount.textContent = completed;
  overdueCount.textContent = overdue;
  streakCount.textContent = Math.min(7, completed);
};

const updateProgress = () => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  summaryText.textContent = `${total} tasks · ${percentage}% complete`;
  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}%`;
};

const isOverdue = (task) => {
  if (!task.due || task.completed) return false;
  const dueDate = new Date(task.due + "T00:00:00");
  const now = new Date();
  return dueDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightMatch = (text, query) => {
  if (!query) return text;
  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, "ig");
  return text.replace(regex, "<mark>$1</mark>");
};

const applyFilters = () =>
  tasks.filter((task) => {
    if (filters.status === "active" && task.completed) return false;
    if (filters.status === "completed" && !task.completed) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.category !== "all" && task.category !== filters.category) return false;
    if (filters.search) {
      const haystack = `${task.title} ${task.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });

const renderTasks = () => {
  const visible = applyFilters();
  taskList.innerHTML = "";

  visible.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";
    if (task.completed) card.classList.add("is-complete");
    if (isOverdue(task)) card.classList.add("overdue");
    card.setAttribute("draggable", "true");
    card.dataset.id = task.id;

    card.innerHTML = `
      <button class="task-check ${task.completed ? "is-complete" : ""}" aria-label="Toggle task">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12l4 4 10-10" />
        </svg>
      </button>
      <div class="task-content">
        <h3>${highlightMatch(task.title, filters.search)}</h3>
        <p>${task.category} · <span class="due">${formatDateLabel(task.due)}</span></p>
        <div class="task-meta">
          <span class="tag ${priorityPalette[task.priority]}">${task.priority}</span>
          ${task.tags
            .map((tag) => `<span class="tag">${highlightMatch(tag, filters.search)}</span>`)
            .join("")}
        </div>
      </div>
      <div class="task-actions">
        <button type="button" data-action="select">Select</button>
        <button type="button" data-action="delete">Delete</button>
      </div>
    `;

    if (task.id === selectedTaskId) card.classList.add("is-selected");

    taskList.appendChild(card);
  });

  emptyState.style.display = visible.length ? "none" : "block";
  updateProgress();
  updateStats();
  buildCategoryPanel();
  saveState();
};

const addTask = (task) => {
  tasks.unshift(task);
  renderTasks();
};

const resetForm = () => {
  taskTitle.value = "";
  taskDue.value = "";
  taskTags.value = "";
  setPriority("medium");
  taskTitle.focus();
};

const createTaskFromForm = () => {
  const priorityButton = document.querySelector(".segmented-btn.is-active");
  return {
    id: crypto.randomUUID(),
    title: taskTitle.value.trim(),
    category: taskCategory.value,
    priority: priorityButton.dataset.priority,
    due: taskDue.value,
    tags: taskTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag),
    completed: false,
    createdAt: new Date().toISOString(),
  };
};

const toggleComplete = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
};

const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return;
  lastDeleted = tasks[index];
  tasks.splice(index, 1);
  selectedTaskId = null;
  renderTasks();
  showUndo();
};

const showUndo = () => {
  undoSnackbar.classList.add("is-visible");
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => {
    undoSnackbar.classList.remove("is-visible");
    lastDeleted = null;
  }, 4000);
};

const undoDeleteTask = () => {
  if (!lastDeleted) return;
  tasks.unshift(lastDeleted);
  lastDeleted = null;
  undoSnackbar.classList.remove("is-visible");
  renderTasks();
};

const updateFilters = (group, value) => {
  filters[group] = value;
  renderTasks();
};

const updateCategoriesFromTasks = () => {
  const existing = new Set(categories);
  tasks.forEach((task) => {
    if (!existing.has(task.category)) {
      categories.push(task.category);
    }
  });
};

const reorderTasks = (draggedId, targetId) => {
  const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
  const targetIndex = tasks.findIndex((task) => task.id === targetId);
  if (draggedIndex === -1 || targetIndex === -1) return;
  const [moved] = tasks.splice(draggedIndex, 1);
  tasks.splice(targetIndex, 0, moved);
};

const reorderCategories = (fromIndex, toIndex) => {
  const [moved] = categories.splice(fromIndex, 1);
  categories.splice(toIndex, 0, moved);
};

const handleDragStart = (event) => {
  const card = event.target.closest(".task-card");
  if (!card) return;
  dragTaskId = card.dataset.id;
  duplicateOnDrop = event.ctrlKey;
  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
};

const handleDragEnd = (event) => {
  const card = event.target.closest(".task-card");
  if (card) card.classList.remove("is-dragging");
  dragTaskId = null;
  duplicateOnDrop = false;
};

const handleDragOver = (event) => {
  event.preventDefault();
  const card = event.target.closest(".task-card");
  if (!card || !dragTaskId) return;
  const targetId = card.dataset.id;
  if (dragTaskId === targetId) return;
  if (duplicateOnDrop) return;
  reorderTasks(dragTaskId, targetId);
  dragTaskId = targetId;
  renderTasks();
};

const handleDrop = () => {
  if (duplicateOnDrop && dragTaskId) {
    const task = tasks.find((item) => item.id === dragTaskId);
    if (task) {
      tasks.unshift({ ...task, id: crypto.randomUUID(), completed: false });
    }
    renderTasks();
  }
};

const handleCategoryDrag = (event) => {
  const item = event.target.closest(".category-item");
  if (!item) return;
  selectedCategoryId = Number(item.dataset.index);
  item.classList.add("is-selected");
  event.dataTransfer.effectAllowed = "move";
};

const handleCategoryDrop = (event) => {
  const item = event.target.closest(".category-item");
  if (!item) return;
  const toIndex = Number(item.dataset.index);
  if (selectedCategoryId === null || selectedCategoryId === toIndex) return;
  reorderCategories(selectedCategoryId, toIndex);
  selectedCategoryId = null;
  buildCategoryFilters();
  renderTasks();
};

const handleCategoryDragEnd = () => {
  selectedCategoryId = null;
  renderTasks();
};

const init = () => {
  loadState();
  loadTheme();
  buildChart();
  updateCategoriesFromTasks();
  buildCategoryFilters();
  setPriority("medium");
  renderTasks();
};

priorityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setPriority(btn.dataset.priority);
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!taskTitle.value.trim()) return;
  const task = createTaskFromForm();
  addTask(task);
  resetForm();
});

taskList.addEventListener("click", (event) => {
  const card = event.target.closest(".task-card");
  if (!card) return;
  const id = card.dataset.id;

  if (event.target.closest(".task-check")) {
    toggleComplete(id);
    return;
  }

  const action = event.target.dataset.action;
  if (action === "delete") {
    deleteTask(id);
  }
  if (action === "select") {
    selectedTaskId = id;
    renderTasks();
  }
});

taskList.addEventListener("dragstart", handleDragStart);

taskList.addEventListener("dragend", handleDragEnd);

taskList.addEventListener("dragover", handleDragOver);

taskList.addEventListener("drop", handleDrop);

statusFilters.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  statusFilters.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  updateFilters("status", btn.dataset.status);
});

priorityFilters.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  priorityFilters.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  updateFilters("priority", btn.dataset.priority);
});

categoryFilters.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  categoryFilters.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  updateFilters("category", btn.dataset.category);
});

searchInput.addEventListener("input", (event) => {
  filters.search = event.target.value.trim();
  renderTasks();
});


undoDelete.addEventListener("click", undoDeleteTask);

document.addEventListener("keydown", (event) => {
  if (event.key === "Delete" && selectedTaskId) {
    deleteTask(selectedTaskId);
  }
});

themeToggle.addEventListener("click", () => {
  const next = appShell.dataset.theme === "dark" ? "light" : "dark";
  appShell.dataset.theme = next;
  themeToggle.textContent = next === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute("aria-pressed", next === "dark");
  localStorage.setItem(themeKey, next);
});

categoryList.addEventListener("dragstart", handleCategoryDrag);

categoryList.addEventListener("dragover", (event) => {
  event.preventDefault();
});

categoryList.addEventListener("drop", handleCategoryDrop);

categoryList.addEventListener("dragend", handleCategoryDragEnd);

init();
