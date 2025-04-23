import express from "express";
import userCont from "../controllers/user.js";
import { validateUser } from "../helpers/validators.js";

const router = express.Router();

router.route("/create-account").post(validateUser, userCont.CreateAccount);
router.route("/signin").post(userCont.Signin);

export default router;
