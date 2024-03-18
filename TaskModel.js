import mongoose from "mongoose";

const taskShema = new mongoose.Schema({
    id: String,
    description: String,
    status: String
});

const TaskModel = mongoose.model(`Task`, taskShema);
export default TaskModel;
