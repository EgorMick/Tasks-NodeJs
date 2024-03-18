import fs from "fs";
import  http from "http";
import { Task } from "./task.js";
import { TaskManager } from "./TaskManager.js";
import chalk from "chalk";
import express from 'express';


const server = http.createServer((req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Error reading file.");
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    });
});


server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
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

//const newTask = new Task(132102, 'Description for Task 9', 'Go on');
//taskManager.addTasks(newTask);
//taskManager.deleteTasks(4);





//ЧЕРЕЗ EXPRESS--------------------------------------------------------------------------------------------
/*
import express from 'express';
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
*/