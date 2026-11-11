let tasks = [];
let nextId = 1;
let currentFilter = "all";
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
function addTask() {
    let title = taskInput.value.trim().replace(/\s+/g, " ");
    if (title === "") {
        alert("Please enter a task!");
        return;
    }    const task = {
        id: nextId++,
        title: title,
        completed: false
    };
    tasks.push(task);
    taskInput.value = "";
   displayTasks();
    updateCounts();
}function completeTask(id) {
    const task = tasks.find(task => task.id === id);
if (!task) {
        alert("Task not found!");
        return;
    }    task.completed = !task.completed;
    displayTasks();
    updateCounts();
}
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
if (index === -1) {
        alert("Task not found!");
        return;
       }   tasks.splice(index, 1);

    displayTasks();
    updateCounts();
}function getPendingTasks() {

    return tasks.filter(task => task.completed === false);
}function getCompletedTasks() {

    return tasks.filter(task => task.completed === true);
}function updateCounts() {

    document.getElementById("totalCount").textContent =
        tasks.length;

    document.getElementById("completedCount").textContent =
        getCompletedTasks().length;

    document.getElementById("pendingCount").textContent =
        getPendingTasks().length;
}
function displayTasks() {    taskList.innerHTML = "";
    let filteredTasks;
    if (currentFilter === "pending") {
        filteredTasks = getPendingTasks();
    } else if (currentFilter === "completed") {
        filteredTasks = getCompletedTasks();
} else {
        filteredTasks = tasks;
    }
    const taskHTML = filteredTasks.map(task => {

        return `
            <div class="task-item">

                <span class="task-title ${task.completed ? "completed" : ""}">
                    ${escapeHTML(task.title)}
                </span>

                <div class="task-actions">

                    <button class="complete-btn"
                        data-action="complete"
                        data-id="${task.id}">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>

                    <button class="delete-btn"
                        data-action="delete"
                        data-id="${task.id}">
                        Delete
                    </button>

                </div>  </div>
        `;
    }).join("");
    taskList.innerHTML = taskHTML;   emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
taskList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;
    const id = Number(button.dataset.id);
if (button.dataset.action === "complete") {
        completeTask(id);
        }    if (button.dataset.action === "delete") {
        deleteTask(id);
    }
});
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = this.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        this.classList.add("active");
        displayTasks();
    });
});
displayTasks();
updateCounts();
