import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
  orderRoutes,
  userRoutes,
  blogRoutes,
  productRoutes,
  taskRoutes,
} from "./routes/index.js";
import { connectDb } from "./config/connectDb.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.use(userRoutes);
app.use(orderRoutes);
app.use(blogRoutes);
app.use(productRoutes);
app.use(taskRoutes);

// Connect to MongoDB
connectDb();

app.listen(process.env.PORT, () => {
  console.log("Server is running at port", process.env.PORT);
});
