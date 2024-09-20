import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  logOutUser,
} from "../controllers/user.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logOutUser);

export default router;
