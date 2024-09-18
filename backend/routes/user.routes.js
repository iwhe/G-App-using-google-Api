import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controllers.js";
import askGemini from "../controllers/gemini.controllers.js";
const router = express.Router();

router.route("/getCurrentUser").get(authMiddleware, getCurrentUser);
router.route("/askgemini").post(askGemini);

export default router;
