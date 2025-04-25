import express from "express";
import userCont from "../controllers/user.js";
import { validateUser } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router.route("/signup").post(validateUser, userCont.CreateAccount);
router.route("/signin").post(userCont.Signin);
router.route("/profile").get(middleware, userCont.GetProfile);
router.route("/signout").post(middleware, userCont.Signout);

export default router;
