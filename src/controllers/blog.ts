import { Response } from "express";
import { CustomRequest } from "../middleware";
import { handleServerError, handleSuccess } from "../helpers";
import { Blog } from "../models";

export default {
  UploadBlog: async (req: CustomRequest, res: Response) => {
    try {
      const { image, title, description } = req.body;

      await Blog.create({ image, title, description, createdBy: req._id });
      handleSuccess(
        res,
        { message: "Blog uploaded successfully" },
        "UploadBlog"
      );
    } catch (error) {
      handleServerError(res, error, "UploadBlog");
    }
  },
  GetBlogs: async (req: CustomRequest, res: Response) => {
    try {
      const { page, offset } = req.query;
      const blogs = await Blog.find({})
        .skip((Number(page) - 1) * Number(offset))
        .limit(Number(offset));

      handleSuccess(res, { blogs }, "GetBlogs");
    } catch (error) {
      handleServerError(res, error, "UploadBlog");
    }
  },
  GetSingleBlog: async (req: CustomRequest, res: Response) => {
    try {
      if (!req.params.id)
        return res.status(400).json({ error: "Provide a blog id" });

      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      handleSuccess(res, { blog }, "GetSingleBlog");
    } catch (error) {
      handleServerError(res, error, "GetSingleBlog");
    }
  },
};
