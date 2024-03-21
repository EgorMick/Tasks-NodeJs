import * as fs from 'node:fs';
import {Task} from "./task.js";
import { EventEmitter } from 'events';
import chalk from 'chalk';
import TaskModel from './TaskModel.js';

class TaskManager extends EventEmitter {
    constructor() {
      super();
      this.tasks = [];
    }

    
    loadTasks() {
        fs.readFile('tasks.json', 'utf-8',(err, data) => {
          if(err){
            console.error("Error reading file:",err);
            return;
          }
          const tasksdata = JSON.parse(data);
          this.tasks = tasksdata.map(task => {
            const newTask = new TaskModel(task);
            newTask.save();
            return newTask;
          })
        })
    }
    
   
      printTasks() {
        this.tasks.forEach(task => {
          console.log(`Task ID: ${task.id}`);
          console.log(`Task Description: ${task.description}`);
          console.log(`Task Status: ${task.status}`);
          console.log('-----------------------------------------------');
        });
      }

      deleteTasks(TaskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === TaskId);
        if (taskIndex !== -1) {
          this.loadTasks();
          this.tasks.splice(taskIndex, 1);
          this.ChangeTasks();
          this.emit('taskDeleted', TaskId);
        } else {
            console.log(`Task with ID ${TaskId} not found.`);
        }
      };


      ChangeTasks() {
        const tasksData = this.tasks.map(task => ({ id: task.id, description: task.description, status: task.status }));
        fs.writeFileSync('tasks.json', JSON.stringify(tasksData), 'utf8');
    }


      addTasks(newTask){
        this.loadTasks();
        this.tasks.push(newTask);
        //console.log(`New task added: ${newTask.description}`);
        this.emit('taskAdded', newTask); // Генерация события taskAdded

        this.ChangeTasks();
      }
}

export{TaskManager}