import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";

const createAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    const adminExists = await Admin.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await Admin.create({
      firstname: "Khel24",
      lastname: "admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

export default createAdmin;
