// controllers/blogController.js
import Blog from "../models/blogModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js"; // make sure you have this

// ✅ CREATE BLOG
export const createBlog = asyncErrorHandler(async (req, res, next) => {
  const {
    title,
    shortDescription,
    description,
    tags,
    category,
    status,
    isFeatured,
  } = req.body;

  if (!title) return next(new AppError("Title is required", 400));

  const blog = await Blog.create({
    title,
    shortDescription,
    description,
    tags,
    category,
    status,
    isFeatured,
    publishedBy: req.user?._id || "65f000000000000000000000", // temp
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

// ✅ GET ALL BLOGS
export const getBlogs = asyncErrorHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    blogs,
  });
});

// ✅ GET SINGLE BLOG
export const getOneBlog = asyncErrorHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

// ✅ UPDATE BLOG
export const updateBlog = asyncErrorHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Blog updated",
    blog,
  });
});

// ✅ DELETE BLOG
export const deleteBlog = asyncErrorHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted",
  });
});