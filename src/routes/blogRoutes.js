import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getOneBlog,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/blogs/", getBlogs);

export default router;
