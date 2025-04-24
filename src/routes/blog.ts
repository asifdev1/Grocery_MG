import express from "express";
import blogCont from "../controllers/blog.js";
import { validateBlog } from "../helpers/validators.js";
import { middleware } from "../middleware/index.js";

const router = express.Router();

router
  .route("/create-blog")
  .post(middleware, validateBlog, blogCont.UploadBlog);

router.route("/blogs").get(middleware, validateBlog, blogCont.GetBlogs);

router.route("/blog/:id").get(middleware, blogCont.GetSingleBlog);
export default router;
