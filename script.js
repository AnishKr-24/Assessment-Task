const API_URL = "https://dummyjson.com/todos";
let todos = [];
let currentPage = 1;
const itemsPerPage = 5;

const elements = {
  todoList: document.getElementById("todoList"),
  pagination: document.getElementById("pagination"),
  loading: document.getElementById("loading"),
  error: document.getElementById("error"),
  form: document.getElementById("todoForm"),
  searchInput: document.getElementById("searchInput"),
  filterBtn: document.getElementById("filterBtn"),
};

function renderTodos() {
  const filtered = filterTodos();
  const paginated = paginate(filtered, currentPage);
  elements.todoList.innerHTML = paginated.length
    ? paginated.map(todo =>
        `<div class="list-group-item">
          <span>${todo.todo} (${todo.date})</span>
        </div>`).join("")
    : `<div class="text-center text-muted">No tasks to display</div>`;

  renderPagination(filtered.length);
}

function paginate(list, page) {
  const start = (page - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
}

function renderPagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  elements.pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    elements.pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>`;
  }
}

function goToPage(page) {
  currentPage = page;
  renderTodos();
}

function filterTodos() {
  const searchText = elements.searchInput.value.toLowerCase();
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  return todos.filter(todo => {
    const matchesText = todo.todo.toLowerCase().includes(searchText);
    const date = todo.date;
    const afterFrom = from ? date >= from : true;
    const beforeTo = to ? date <= to : true;
    return matchesText && afterFrom && beforeTo;
  });
}


function toggleLoading(state) {
  elements.loading.classList.toggle("d-none", !state);
}

function renderTodos() {
  const filtered = filterTodos();
  const paginated = paginate(filtered, currentPage);
  elements.todoList.innerHTML = paginated.length
    ? paginated.map(todo =>
        `<div class="list-group-item d-flex justify-content-between align-items-center">
          <span>${todo.todo} (${todo.date})</span>
          <button class="btn btn-sm btn-danger" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>`).join("")
    : `<div class="text-center text-muted">No tasks to display</div>`;

  renderPagination(filtered.length);
}

// Add Todo manually
elements.form.addEventListener("submit", async e => {
  e.preventDefault();
  const task = document.getElementById("taskInput").value;
  const date = document.getElementById("taskDate").value;

  try {
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: task, completed: false, userId: 1 })
    });

    const newTodo = await res.json();
    todos.unshift({ ...newTodo, date });
    renderTodos();
    e.target.reset();
  } catch (err) {
    alert("Failed to add task");
  }
});

async function deleteTodo(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    // Optional: Send DELETE request to dummy API
    await fetch(`https://dummyjson.com/todos/${id}`, {
      method: "DELETE",
    });

    // Remove from local state
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
  } catch (err) {
    alert("Failed to delete task");
  }
}


// Search and filter events
elements.searchInput.addEventListener("input", renderTodos);
elements.filterBtn.addEventListener("click", renderTodos);
