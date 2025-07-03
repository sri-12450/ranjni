const API_URL = 'http://localhost:3000/tasks';

function toggleTheme() {
  document.body.classList.toggle("dark");
}

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="badge ${task.status}">${task.status.toUpperCase()}</span>
      <span class="task-title ${task.status === 'done' ? 'done' : ''}">
        ${task.title}
      </span>
      <div class="task-actions">
        <button class="${task.status === 'done' ? 'undo-btn' : 'done-btn'}" 
                onclick="toggleStatus(${task.id}, '${task.status}')">
          ${task.status === 'done' ? 'Undo' : 'Done'}
        </button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (!title) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  input.value = '';
  fetchTasks();
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'done' ? 'pending' : 'done';
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

fetchTasks();
