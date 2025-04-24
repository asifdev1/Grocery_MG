import express from "express";
import blogCont from "../controllers/blog.js";
import { validateBlog, validateBlogParam } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router
  .route("/create-blog")
  .post(middleware, validateBlog, blogCont.UploadBlog);

router
  .route("/blogs")
  .get(middleware, validateBlog, validateBlogParam, blogCont.GetBlogs);

export default router;
