require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require('path');
const PORT = 8080;
const app = express();
const models = require("./models/todo");
const todo = models.Todo;

app.use(cors({ 
  origin:['https://mern-todo-client-rho.vercel.app'],
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true }));
app.use(express.json());
// app.use(express.static(process.env.PUBLIC_DIR))

const createTodo = async (req, res) => {
  const task = req.body.task;
  const taskId = req.body.taskId;
  const newTodo = new todo({
    taskId: taskId,
    task: task,
  });

  await newTodo
    .save()
    .then(() => console.log("Todo created"))
    .catch((err) => console.log(err));

  res.status(201).send(req.body);
};
const getTodo = async (req, res) => {
  try {
    const todos = await todo.find();
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json("internal server error");
  }
};

const deleteTodo = async (req, res) => {
  const taskId = req.params.id;
  console.log("this is taskId--->" + taskId);
  try {
    const deletedTodo = await todo.findByIdAndDelete(taskId); // play attention on the method of findOneAndDelete
    if (!deletedTodo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.status(200).json({ message: "todo deleted", deletedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json("internal server error");
  }
};

const updateTodo = async (req, res) => {
  const taskId = req.params.id;
  const task = req.body.task;
  console.log(task);
  console.log("taskId : " + taskId);
  try {
    const updatedTodo = await todo.findByIdAndUpdate(
      taskId,
      { task: task },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.status(200).json({ message: "todo updated", updatedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json("internal server error");
  }
};

app.get("/",(req,res)=>{
  res.json({message: "hello world"})
})
app.post("/api/todos", createTodo);
app.get("/api/todos", getTodo);
app.delete("/api/todos/:id", deleteTodo);
app.put("/api/todos/:id", updateTodo);

app.get('/',(req,res)=>{
  app.use(express.static(path.resolve(__dirname,"client","dist")));
  res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT} ------>`);
});
