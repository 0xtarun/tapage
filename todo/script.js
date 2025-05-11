document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const tasksLeftSpan = document.getElementById('tasksLeft');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];  
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        updateDateTime();
        setInterval(updateDateTime, 1000);
        renderTasks();
        addEventListeners();
        updateTasksLeft();
        updateProgressBar();
    }
    
    // Update current date and time
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString(undefined, options);
        document.getElementById('datetime').textContent = `${timeString}, ${dateString}`;
    }
    
    // Add event listeners
    function addEventListeners() {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        allBtn.addEventListener('click', () => {
            currentFilter = 'all';
            updateActiveFilter();
            renderTasks();
        });
        
        activeBtn.addEventListener('click', () => {
            currentFilter = 'active';
            updateActiveFilter();
            renderTasks();
        });
        
        completedBtn.addEventListener('click', () => {
            currentFilter = 'completed';
            updateActiveFilter();
            renderTasks();
        });
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }
    
    // Update active filter button style
    function updateActiveFilter() {
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        
        if (currentFilter === 'all') allBtn.classList.add('active');
        if (currentFilter === 'active') activeBtn.classList.add('active');
        if (currentFilter === 'completed') completedBtn.classList.add('active');
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        updateTasksLeft();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = [];
        
        if (currentFilter === 'all') {
            filteredTasks = tasks;
        } else if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet' : 
                                      currentFilter === 'active' ? 'No active tasks' : 'No completed tasks';
            emptyMessage.style.color = '#080';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
            
            const taskText = document.createElement('span');
            taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
            taskText.textContent = task.text;
            

            const infoBtn = document.createElement('div');
            infoBtn.className = 'info-btn';
            infoBtn.innerHTML = 'i<span class="tooltip">Created: ' + new Date(task.id).toLocaleString() + '</span>'; // Display creation timestamp
             
             
            
           

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(infoBtn)
            taskItem.appendChild(deleteBtn);
            
            taskList.appendChild(taskItem);  
        });
    }
    
    // Toggle task completion status
    function toggleTaskComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTasksLeft();
        updateProgressBar();
    }
    
    // Delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTasksLeft();
        updateProgressBar();
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTasksLeft();
        updateProgressBar();
    }
    
    // Update tasks left counter
    function updateTasksLeft() {
        const activeTasksCount = tasks.filter(task => !task.completed).length;
        tasksLeftSpan.textContent = `${activeTasksCount} ${activeTasksCount === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Update the progress bar
    function updateProgressBar() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        progressBar.style.width = `${progress}%`; // Set the width of the progress bar
        progressPercentage.textContent = `(${progress}% completed)`; // Update the text with percentage
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
});