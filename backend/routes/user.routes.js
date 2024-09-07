import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controllers.js";
const router = express.Router();

router.route("/getCurrentUser").get(authMiddleware, getCurrentUser);

export default router;
