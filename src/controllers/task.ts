import { Response } from "express";
import { CustomRequest } from "../middleware/index.js";
import { Task } from "../models/index.js";
import { handleServerError, handleSuccess } from "../helpers/index.js";

export default {
  CreateTask: async (req: CustomRequest, res: Response) => {
    try {
      const {
        taskType,
        description,
        dueDate,
        priorityLevel,
        assignee,
        location,
      } = req.body;

      const newTask = await Task.create({
        taskType,
        assignee,
        location,
        description,
        dueDate,
        priorityLevel,
      });

      handleSuccess(
        res,
        { message: "Task created successfully", task_id: newTask._id },
        "CreateTask"
      );
    } catch (error) {
      handleServerError(res, error, "CreateTask");
    }
  },

  //  api to simply fetch tasks using page and offset query
  GetTasks: async (req: CustomRequest, res: Response) => {
    try {
      const { page, offset } = req.query;
      const tasks = await Task.find({})
        .skip(Number(offset) * (Number(page) - 1))
        .limit(Number(offset))
        .sort({ createdAt: -1 });

      handleSuccess(res, { tasks }, "GetTasks");
    } catch (error) {
      handleServerError(res, error, "GetTasks");
    }
  },
};
