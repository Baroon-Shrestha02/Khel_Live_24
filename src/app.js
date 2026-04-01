import express from "express";
import cors from "cors";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import storiesRoutes from "./routes/storyRoutes.js";
import { startStoryCleanup } from "./utils/cron.js";

const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", storiesRoutes);

app.use(globalErrorHandler);

startStoryCleanup();

export default app;
