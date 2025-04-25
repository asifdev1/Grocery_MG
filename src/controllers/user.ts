import { Token, User } from "../models/index.js";
import {
  handleError,
  handleSuccess,
  handleServerError,
} from "../helpers/index.js";
import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middleware/index.js";
import moment from "moment";

export default {
  CreateAccount: async (req: CustomRequest, res: Response) => {
    try {
      const { firstName, middleName, lastName, email, phone, password } =
        req.body;

      // check if email is unique or not
      const userExists = await User.findOne({ email });
      if (userExists) {
        handleError(res, "Email already exists", "CreateAccount");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password : ", password);
      console.log("Hashed Password : ", hashedPassword);

      const newUser = new User({
        firstName,
        middleName,
        lastName,
        email,
        phone,
        password,
      });
      await newUser.save();

      handleSuccess(
        res,
        { message: "User created successfully" },
        "CreateAccount"
      );
    } catch (error) {
      handleServerError(res, error, "CreateAccount");
    }
  },
  Signin: async (req: CustomRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      console.log("email password => ", email, password);

      // Finding that user to login... ("+select" for getting the hidden password)
      const user = await User.findOne({ email }).select("+password");
      console.log("User found -> ", user);
      //  IF GIVEN email DOESN'T EXIST...
      if (!user) {
        handleError(res, "User not found", "Signin");
        return;
      }
      // MATCHING PASSWORD...
      const isCorrect = await bcrypt.compare(password, user?.password);
      console.log("Matching => ", isCorrect);

      if (!isCorrect) {
        //   WRONG PASSWORD.....
        handleError(res, "Wrong credentials! Try again..", "Signin");
        return;
      }

      //   GENERATING TOKEN AFTER LOGIN...
      const token = jwt.sign({ _id: user?._id }, process.env?.JWT_SECRET!);
      await Token.create({
        token,
        expires: moment().add(10, "minutes").toDate(),
      });

      handleSuccess(res, { message: "Signin successful", token }, "Signin");
    } catch (error) {
      handleServerError(res, error, "Signin");
    }
  },
  Signout: async (req: CustomRequest, res: Response) => {
    try {
      // LOGOUT USER...
      const token = req.header("Authorization")?.replace("Bearer ", "");
      console.log(token);

      await Token.deleteOne({
        token,
      });

      handleSuccess(res, "User logged out successfully.", "Signout");
    } catch (error) {
      handleServerError(res, error, "Signout");
    }
  },
  GetProfile: async (req: CustomRequest, res: Response) => {
    try {
      const user_id = req._id;

      const user = await User.findById(user_id);
      if (!user) {
        handleError(res, "User not found.", "GetProfile");
        return;
      }

      handleSuccess(res, { user }, "GetProfile");
    } catch (error) {
      handleServerError(res, error, "GetProfile");
    }
  },
};
