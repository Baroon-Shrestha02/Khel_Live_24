import Blog from "../models/blogModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const createBlog = asyncErrorHandler(async (req, res, next) => {});

export const getBlogs = asyncErrorHandler(async (req, res, next) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });

  res.status(200).send({
    success: true,
    blogs,
  });
});

export const getOneBlog = asyncErrorHandler(async (req, res, next) => {});

export const updateBlog = asyncErrorHandler(async (req, res, next) => {});

export const deleteBlog = asyncErrorHandler(async (req, res, next) => {});
