import jwt from "jsonwebtoken";
import express from "express";

//  custom request interface with _id
export interface CustomRequest extends express.Request {
  _id?: string;
}

export const middleware = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Invalid auth token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      _id: string;
    };
    req._id = decoded._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized access" });
  }
};
