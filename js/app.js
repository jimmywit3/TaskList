// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  // DOM Load event
  document.addEventListener('DOMContentLoaded', renderTaskList);
  // Add task event
  form.addEventListener('submit', addTask);
  // Remove task event
  taskList.addEventListener('click', removeTask);
  // Clear task event
  clearBtn.addEventListener('click', clearTasks);
  // Filter tasks event
  filter.addEventListener('keyup', filterTasks);
}

// Get Tasks from LS
function getTasksArray() {
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  return tasks;
}

function renderTaskList() {
  let tasks = getTasksArray();

  tasks.forEach(function(task){
    renderTask(task);
  });
}

function renderTask(textNode) {
  const li = document.createElement('li');
  li.className = 'collection-item';
  li.appendChild(document.createTextNode(textNode));
  
  const link = document.createElement('a');
  link.className = 'delete-item secondary-content';
  link.innerHTML = '<i class="fa fa-remove"></i>';
  
  li.appendChild(link);
  taskList.appendChild(li);
}

// Add Task
function addTask(e) {

  let task = taskInput.value;
  if (task === '') {
    alert('Add a task');
    return;
  }

  renderTask(task);
  storeTaskInLocalStorage(task);
  taskInput.value = '';

  e.preventDefault();
}

// Store Task
function storeTaskInLocalStorage(task) {
  let tasks = getTasksArray();
  tasks.push(task);
  saveTasksToLocalStorage(tasks);
}

// Remove Task
function removeTask(e) {
  let parent = e.target.parentElement;
  
  if (parent.classList.contains('delete-item')) {
    if(confirm('Are You Sure?')) {
      parent.parentElement.remove();
      removeTaskFromLocalStorage(parent.parentElement);
    }
  }
}

function saveTasksToLocalStorage(tasks = getTasksArray()) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove from LS
function removeTaskFromLocalStorage(taskItem) {
  let tasks = getTasksArray();

  tasks.forEach(function(task, index){
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });

  saveTasksToLocalStorage(tasks);
}

// Clear Tasks
function clearTasks() {
  // Faster than innerHTML (https://jsperf.com/innerhtml-vs-removechild)
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  clearTasksFromLocalStorage();
}

// Clear Tasks from LS
function clearTasksFromLocalStorage() {
  localStorage.clear();
}

// Filter Tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach(function(task) {
    const item = task.firstChild.textContent;
    if (~item.toLowerCase().indexOf(text)) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}