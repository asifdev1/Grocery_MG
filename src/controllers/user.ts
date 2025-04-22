import { User } from "../models/index.js";
import {
  handleError,
  handleSuccess,
  handleServerError,
} from "../helpers/index.js";
import { Request, Response } from "express";

export default {
  Signin: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      console.log("username password", username, password);

      handleSuccess(res, { message: "Signin successful" }, "Signin");
    } catch (error) {
      handleServerError(res, error, "Signin");
    }
  },
  CreateAccount: async (req: Request, res: Response) => {
    try {
      const newUser = new User({
        firstName: "Md",
        lastName: "Asif",
        email: "asif@gmail.com",
        phone: "03321234567",
        password: "password",
      });
      await newUser.save();

      handleSuccess(res, newUser, "CreateAccount");
    } catch (error) {
      handleServerError(res, error, "CreateAccount");
    }
  },
};
