import { TaskManager } from "./TaskManager.js";
import { Task } from "./task.js";

const taskManager = new TaskManager();
taskManager.loadTasks();
taskManager.printTasks();
taskManager.deleteTasks(2);
const newTask = new Task(4, 'Complete project', 'In progress');
taskManager.addTasks(newTask);