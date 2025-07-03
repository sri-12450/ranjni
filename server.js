const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const TASK_FILE = './backend/tasks.json';

// Load tasks from file
const loadTasks = () => JSON.parse(fs.readFileSync(TASK_FILE));

// Save tasks to file
const saveTasks = (tasks) => fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    status: 'pending'
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// Update task status
app.put('/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == req.params.id);
  if (task) {
    task.status = req.body.status;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id != req.params.id);
  saveTasks(tasks);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
