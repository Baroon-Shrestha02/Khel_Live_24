import Blog from "../models/blogModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

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

  // 🔴 VALIDATION
  if (!title || title.trim() === "") {
    return next(new AppError("Title is required", 400));
  }

  if (!shortDescription || shortDescription.trim() === "") {
    return next(new AppError("Short description is required", 400));
  }

  if (!description || description.trim() === "") {
    return next(new AppError("Description is required", 400));
  }

  if (!category || category.trim() === "") {
    return next(new AppError("Category is required", 400));
  }

  if (tags && !Array.isArray(tags)) {
    return next(new AppError("Tags must be an array", 400));
  }

  if (status && !["draft", "published"].includes(status)) {
    return next(new AppError("Status must be 'draft' or 'published'", 400));
  }

  if (isFeatured && typeof isFeatured !== "boolean") {
    return next(new AppError("isFeatured must be true or false", 400));
  }

  // ✅ CREATE BLOG
  const blog = await Blog.create({
    title: title.trim(),
    shortDescription: shortDescription.trim(),
    description: description.trim(),
    tags,
    category: category.trim(),
    status,
    isFeatured,
    publishedBy: req.user?._id || "65f000000000000000000000",
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
export const getOneBlog = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Blog ID is required", 400));
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

// ✅ UPDATE BLOG
export const updateBlog = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Blog ID is required", 400));
  }

  // Optional validation (only if fields provided)
  if (req.body.status && !["draft", "published"].includes(req.body.status)) {
    return next(new AppError("Invalid status value", 400));
  }

  if (req.body.tags && !Array.isArray(req.body.tags)) {
    return next(new AppError("Tags must be an array", 400));
  }

  const blog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true, // important
  });

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

// ✅ DELETE BLOG
export const deleteBlog = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Blog ID is required", 400));
  }

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});