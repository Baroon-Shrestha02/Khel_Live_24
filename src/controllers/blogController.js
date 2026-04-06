import Blog from "../models/blogModel.js";
import { uploadMedias, deleteMedia } from "../middlewares/uploadMedias.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// POST /api/add-blog
export const createBlog = asyncErrorHandler(async (req, res, next) => {
  const { title, summary, category, tags, status, content, featured } =
    req.body;

  if (!title) return next(new AppError("Title is required", 400));
  if (!content) return next(new AppError("Content is required", 400));
  if (!req.file) return next(new AppError("Hero image is required", 400));

  const uploadedHero = await uploadMedias(req.file, "blogs/hero");

  const blog = await Blog.create({
    title,
    summary,
    category,
    tags: tags ? JSON.parse(tags) : [],
    status: status || "draft",
    heroImage: {
      public_id: uploadedHero.public_id,
      url: uploadedHero.url,
    },
    featured: false,
    content, // markdown string from rich text editor
  });

  return res.status(201).json({
    message: "Blog created successfully",
    data: blog,
  });
});

// GET /api/get-blogs
export const getBlogs = asyncErrorHandler(async (req, res) => {
  const { status, category, tags, limit, sort } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(",") };

  const sortOrder =
    sort === "-createdAt" ? { createdAt: -1 } : { createdAt: -1 };
  const limitNum = limit ? parseInt(limit) : 0; // 0 = no limit in mongoose

  const blogs = await Blog.find(filter)
    // .select("-content")
    .sort(sortOrder)
    .limit(limitNum);

  return res.status(200).json({
    message: "Blogs fetched successfully",
    total: blogs.length,
    data: blogs,
  });
});

// GET /api/get-blog/:id
export const getOneBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) return next(new AppError("Blog not found", 404));

  return res.status(200).json({
    message: "Blog fetched successfully",
    data: blog,
  });
});

// PUT /api/update-blog/:id
export const updateBlog = asyncErrorHandler(async (req, res, next) => {
  const { title, summary, category, tags, status, content, featured } =
    req.body;

  if (status && !["draft", "published"].includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const existingBlog = await Blog.findById(req.params.id);
  if (!existingBlog) return next(new AppError("Blog not found", 404));

  const updateFields = {};
  if (title) updateFields.title = title;
  if (summary) updateFields.summary = summary;
  if (category) updateFields.category = category;
  if (tags) updateFields.tags = JSON.parse(tags);
  if (status) updateFields.status = status;
  if (content) updateFields.content = content;
  if (featured) updateFields.featured = featured;

  // Replace hero image if new one uploaded
  if (req.file) {
    if (existingBlog.heroImage?.public_id) {
      await deleteMedia(existingBlog.heroImage.public_id);
    }
    const uploadedHero = await uploadMedias(req.file, "blogs/hero");
    updateFields.heroImage = {
      public_id: uploadedHero.public_id,
      url: uploadedHero.url,
    };
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: updateFields },
    { new: true, runValidators: true },
  );

  return res.status(200).json({
    message: "Blog updated successfully",
    data: blog,
  });
});

// DELETE /api/delete-blog/:id
export const deleteBlog = asyncErrorHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) return next(new AppError("Blog not found", 404));

  if (blog.heroImage?.public_id) {
    await deleteMedia(blog.heroImage.public_id);
  }

  await blog.deleteOne();

  return res.status(200).json({ message: "Blog deleted successfully" });
});

export const getCategories = asyncErrorHandler(async (req, res, next) => {
  const categories = await Blog.aggregate([
    {
      $match: { status: "published" }, // optional but recommended
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  res.status(200).send({
    success: true,
    data: categories,
  });
});

export const getFeaturedBlog = asyncErrorHandler(async (req, res, next) => {
  const featured = await Blog.find({ featured: true });

  res.status(200).send({ succes: true, data: featured });
});
