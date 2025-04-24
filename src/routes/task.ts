import express from "express";
import TaskCont from "../controllers/task.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router.route("/tasks").post(middleware, TaskCont.CreateTask);
router.route("/tasks").get(middleware, TaskCont.GetTasks);

export default router;
