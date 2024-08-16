function addTask() {
    const taskText = document.getElementById('new-task').value;
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const pendingTasks = document.getElementById('pending-tasks');
    const newTask = document.createElement('li');
    newTask.innerHTML = `
        ${taskText}
        <div class="task-actions">
            <button onclick="markComplete(this)" title="Complete"><i class="fas fa-check"></i></button>
            <button onclick="deleteTask(this)" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    pendingTasks.appendChild(newTask);
    document.getElementById('new-task').value = '';
}

function markComplete(button) {
    const task = button.closest('li');
    task.classList.add('completed');
    document.getElementById('completed-tasks').appendChild(task);
}

function deleteTask(button) {
    const task = button.closest('li');
    task.remove();
}