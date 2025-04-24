import jwt from "jsonwebtoken";
import express from "express";
import { Token } from "../models/index.js";

//  custom request interface with _id
export interface CustomRequest extends express.Request {
  _id?: string;
}

export const middleware = async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Invalid auth token");
    }

    const ifExist = await Token.findOne({
      token,
      expires: {
        $gt: new Date(),
      },
    });
    console.log("Token => ", ifExist);
    if (!ifExist) throw new Error("Authorization error !");

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      _id: string;
    };
    req._id = decoded._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized access" });
  }
};
