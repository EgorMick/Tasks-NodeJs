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


//Создание сервера
const app = express();
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


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.json(tasks);
        
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});


app.post('/tasks', async (req, res) => { 
    try {
        const newTask = new TaskModel(req.body);
        const savedTask = await newTask.save(); 
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const TaskId = req.params.id;
    try {
        const task = await TaskModel.findById(TaskId); 
        if (!task) {
            return res.status(404).send('Task not found'); 
        }
        await TaskModel.deleteOne({ _id: TaskId }); 
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

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