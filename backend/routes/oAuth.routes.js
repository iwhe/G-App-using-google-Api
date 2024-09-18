import express from "express";
import passport from "../config/oauth.config.js";
import {
  googleCallback,
  getInbox,
  sendEmail,
  registerSuccess,
  getSentEmail,
  viewMail,
} from "../controllers/oAuth.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.modify"],
    accessType: "offline",
    prompt: "consent",
  })
);

// Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/oauth/register/failed",
  }),
  googleCallback
);

router.get("/register/success", registerSuccess);

// Gmail routes
router.route("/gmail/inbox").get(authMiddleware, getInbox);
router.route("/gmail/sentEmail").get(authMiddleware, getSentEmail);
router.route("/gmail/send").post(authMiddleware, sendEmail);
router.route("/email/getEmailById/:id").get(authMiddleware, viewMail);

export default router;
