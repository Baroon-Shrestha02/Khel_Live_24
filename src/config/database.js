import mongoose from "mongoose";

const Database = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log(`Database connected to successfully.`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default Database;
