import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import Database from "./config/database.js";
import createAdmin from "./utils/createAdmin.js";

const PORT = process.env.PORT || 3000;

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
