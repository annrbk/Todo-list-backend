const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 3001;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/taskbox");

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error getting tasks", error: err });
  }
});

app.post("/api/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text,
    completed: false,
  });
  await newTask.save();
  res.json(newTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completed: req.body.completed } },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
});

app.listen(3001, () => console.log("Server started on port 3001"));
