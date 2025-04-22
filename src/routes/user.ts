import express from "express";
import userCont from "../controllers/user.js";

const router = express.Router();

router.route("/create-account").post(userCont.CreateAccount);
router.route("/signin").post(userCont.Signin);

export default router;
