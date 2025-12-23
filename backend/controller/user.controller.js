import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Get all users with task counts
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });

        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });

        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.status(200).json({ success: true, users: userWithTaskCounts });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid user ID"));
    }

    const user = await User.findById(id).select("-password");
    if (!user) return next(errorHandler(404, "User not found!"));

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
