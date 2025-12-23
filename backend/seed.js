import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "./models/user.model.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Delete all users first (optional)
    await User.deleteMany({});
    console.log("Existing users removed");

    // Create admin
    const admin = new User({
      name: "Admin",
      email: "admin@test.com",
      password: bcryptjs.hashSync("admin123", 10),
      role: "admin",
    });

    // Create normal user
    const user = new User({
      name: "Fahad",
      email: "fahad@test.com",
      password: bcryptjs.hashSync("123456", 10),
      role: "user",
    });

    await admin.save();
    await user.save();

    console.log("Admin and User created successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
