import express from "express";
import userCont from "../controllers/user.js";
import { validateUser } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router.route("/create-account").post(validateUser, userCont.CreateAccount);
router.route("/signin").post(userCont.Signin);
router.route("/profile").get(userCont.GetProfile);

export default router;
