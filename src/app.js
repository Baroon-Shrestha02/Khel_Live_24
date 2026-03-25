import express from "express";
import cors from "cors";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import storiesRoutes from "./routes/storyRoutes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", storiesRoutes);

app.use(globalErrorHandler);

export default app;
