import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskType: {
    type: String,
    enum: ["Order-related", "Shipment-related", "Payment-related", "Others"],
  },
  assignee: {
    type: String,
    required: true,
  },
  priorityLevel: {
    type: String,
    enum: ["Critical", "High", "Moderate", "Low"],
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Task", taskSchema);
