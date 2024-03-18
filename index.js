import mongoose from 'mongoose';
import 'dotenv/config';
import { TaskManager } from './Taskmanager.js';

const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

mongoose.connect(mongoUri)
 .then(() => console.log("Mongo08 connected"))
 .catch(err => console.error('MongoDB connection error:', err));
 const taskManager = new TaskManager();
 taskManager.loadTasks();
