import fs from "fs";
import  http from "http";
import { Task } from "./task.js";
import { TaskManager } from "./TaskManager.js";
import chalk from "chalk";
import express from 'express';
import TaskModel from "./TaskModel.js";
import mongoose from "mongoose";
import 'dotenv/config';
import {validateTaskData} from './middlewares/validateTaskData.js';
import cors from "cors";

//Создание сервера
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Вы на корневой странице!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Main - http://localhost:3000/, Tasks - http://localhost:3000/tasks`)
});

//подключение к БД
const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
mongoose.connect(mongoUri)

// ОТОБРАЖЕНИЕ ЗАДАЧ
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find({});
        res.setHeader('Content-Type', 'application/json');
        res.json(tasks);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

//ИЗМЕНЕНИЕ СТАТУСА
app.post("/updateTaskStatus", async (req, res) => {
    try {
      const taskName = req.body.name;
      const newStatus = req.body.status;
  
      const task = await TaskModel.findOne({ description: taskName });
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      task.status = newStatus;
      await task.save();
  
      res.status(200).json({ message: "Status updated successfully" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  //УДАЛЕНИЕ ЗАДАЧИ ИЗ БД
  app.delete('/tasks', async (req, res) => {
    try {
      await TaskModel.deleteMany({ status: 'Корзина' });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  //ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
  app.post('/tasks', async (req, res) => { 
    
        const newTaskData = req.body;
        newTaskData.status = "В процессе";
        
        const newTask = new TaskModel(newTaskData);
        const savedTask = await newTask.save(); 
});

//ВАЛИДАЦИЯ
app.post('/tasks', validateTaskData, async (req, res) => {
    // обработка запроса...
    try {
        const newTask = new TaskModel(req.body);
        const savedTask = await newTask.save(); 
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



/*
const taskManager = new TaskManager();

function printRed(str){
    console.log(chalk.redBright(str));
}

function printGreen(str){
    console.log(chalk.greenBright(str));
}

taskManager.on('taskAdded', (task) => {
    printGreen(`Event: New task with ID ${task.id} added:`);
    console.log(`Task ID: ${task.id}, Description: ${task.description}, Status: ${task.status}`);
    console.log();
});

taskManager.on('taskDeleted', (TaskId) => {
    printRed(`Event: Task with ID ${TaskId} deleted`);
    console.log();
});

*/