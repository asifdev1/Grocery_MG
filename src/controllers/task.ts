import { Response } from "express";
import { CustomRequest } from "../middleware";
import { Task } from "../models";
import { handleServerError, handleSuccess } from "../helpers";

export default {
  CreateTask: async (req: CustomRequest, res: Response) => {
    try {
      const { title, description, dueDate, priority } = req.body;
      const newTask = await Task.create({
        title,
        description,
        dueDate,
        priority,
        createdBy: req._id,
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
};
