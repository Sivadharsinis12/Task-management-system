const cors = require("cors");

app.use(cors({
    origin: "https://YOUR-FRONTEND.onrender.com"
}));
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// JSON file path
const filePath = path.join(__dirname, "data.json");

// Read tasks from JSON file
function readTasks() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Save tasks into JSON file
function saveTasks(tasks) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(tasks, null, 4)
    );
}

// GET: Display all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// POST: Add a new task
app.post("/api/tasks", (req, res) => {
    const tasks = readTasks();

    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const task = {
        id: tasks.length
            ? Math.max(...tasks.map(t => t.id)) + 1
            : 1,
        title: req.body.title.trim(),
        completed: false
    };

    tasks.push(task);

    saveTasks(tasks);

    console.log("Task saved:", task);

    res.status(201).json(task);
});

// PUT: Complete or undo a task
app.put("/api/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
            message: "Invalid completion status"
        });
    }

    task.completed = req.body.completed;

    saveTasks(tasks);

    console.log("Task updated:", task);

    res.json(task);
});

// DELETE: Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1)[0];

    saveTasks(tasks);

    console.log("Task deleted:", deletedTask);

    res.json({
        message: "Task deleted successfully"
    });
});

// TEST: Check whether JSON file saving works
app.get("/test-save", (req, res) => {
    const testData = [
        {
            id: 1,
            title: "Test Task",
            completed: false
        }
    ];

    saveTasks(testData);

    res.send("Data saved successfully!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
