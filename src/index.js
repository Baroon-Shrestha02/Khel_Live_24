import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import Database from "./config/database.js";
import createAdmin from "./utils/createAdmin.js";
import cloudinary from "cloudinary";

const PORT = process.env.PORT || 3000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

Database()
  .then(async () => {
    await createAdmin();
    app.listen(PORT, () => {
      console.log(`Server listeniing on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
