import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { userRoutes } from "./routes/index.js";
import { connectDb } from "../config/connectDb.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(userRoutes);

// Connect to MongoDB
connectDb();

app.listen(process.env.PORT, () => {
  console.log("Server is running at port", process.env.PORT);
});
