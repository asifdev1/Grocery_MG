import { Response } from "express";
import { CustomRequest } from "../middleware/index.js";
import { handleServerError, handleSuccess } from "../helpers/index.js";
import { Blog } from "../models/index.js";

export default {
  UploadBlog: async (req: CustomRequest, res: Response) => {
    try {
      const { image, title, description } = req.body;

      const newBlog = await Blog.create({
        image,
        title,
        description,
        createdBy: req._id,
      });

      handleSuccess(
        res,
        { message: "Blog uploaded successfully", blogId: newBlog?._id },
        "UploadBlog"
      );
    } catch (error) {
      handleServerError(res, error, "UploadBlog");
    }
  },

  GetBlogs: async (req: CustomRequest, res: Response) => {
    try {
      const { page = 1, offset = 10 } = req.query;

      const blogs = await Blog.find({})
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(offset))
        .limit(Number(offset));

      handleSuccess(res, { blogs }, "GetBlogs");
    } catch (error) {
      handleServerError(res, error, "UploadBlog");
    }
  },

  GetSingleBlog: async (req: CustomRequest, res: Response) => {
    try {
      if (!req.params.id) {
        res.status(400).json({ error: "Provide a blog id" });
        return;
      }

      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }
      handleSuccess(res, { blog }, "GetSingleBlog");
    } catch (error) {
      handleServerError(res, error, "GetSingleBlog");
    }
  },
};
