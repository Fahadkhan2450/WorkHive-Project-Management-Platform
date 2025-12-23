import express from "express";
import { getUsers } from "../controller/user.controller.js";
import { verifyToken, adminOnly } from "../utils/verifyUser.js";

const router = express.Router();

// Only admin can access users list
router.get("/get-users", verifyToken, adminOnly, getUsers);

export default router;
