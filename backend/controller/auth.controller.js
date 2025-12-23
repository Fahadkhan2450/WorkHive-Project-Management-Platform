import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, profileImageUrl, adminJoinCode } = req.body;

    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const isAlreadyExist = await User.findOne({ email });
    if (isAlreadyExist) {
      return next(errorHandler(400, "User already exists"));
    }

    // Determine role based on admin token
    let role = "user";
    if (adminJoinCode && adminJoinCode.trim() === process.env.ADMIN_JOIN_CODE?.trim()) {
      role = "admin";
      console.log("Admin token matched! Setting role to admin.");
    } else {
      console.log("Admin token not matched, defaulting to user.");
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user with correct role
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = newUser._doc;

    res
      .status(201)
      .cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .json({ success: true, user: rest, token }); // <-- return token to frontend
  } catch (error) {
    next(error);
  }
};

// Signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"));
    }

    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Wrong credentials"));

    // Create token
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .json({ success: true, user: rest, token }); // <-- return token to frontend
  } catch (error) {
    next(error);
  }
};

// Get User Profile
export const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;
    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await user.save();
    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// Upload Image
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(errorHandler(400, "No file uploaded"));

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    next(error);
  }
};

// Signout
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      success: true,
      message: "User has been logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};
