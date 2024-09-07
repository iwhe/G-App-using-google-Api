import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const router = express.Router();
import connectDB from "../db/connect.js";
import { generateAccessAndRefreshToken } from "../controllers/user.controllers.js";

const db = await connectDB();

passport.serializeUser((user, done) => {
  // console.log("serialize User", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // console.log("de-serialize User", user);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "/api/v1/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      // try {
      const [existingUser] = await db.query(
        "SELECT * FROM user WHERE googleId = ?",
        [profile.id]
      );
      console.log(existingUser);

      console.log("Existing user checked!");

      if (existingUser.length > 0) {
        console.log("User already exists");
        return cb(null, existingUser[0]);
      } else {
        console.log("Initiating insertion of user into db", profile.id);

        await db.query(
          "INSERT INTO user (googleId, full_name, userImg, email) VALUES (?, ?, ?, ?)",
          [
            profile.id,
            profile.displayName,
            profile.photos[0].value,
            profile.emails[0].value,
          ]
        );
      }
      const [newUser] = await db.query(
        "SELECT * FROM user WHERE googleId = ?",
        [profile.id]
      );

      console.log("Login/Sign in successfully");
      return cb(null, newUser[0]); // Return the first user, assuming googleId is unique
      // } catch (err) {
      //   console.error("Error during OAuth process", err);
      //   return cb(err, false);
      // }
    }
  )
);

let options = {
  httpOnly: true,
  secure: true,
};

router.get("/register/success", async (req, res) => {
  if (req.user) {
    const id = req.user.id;

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        error: false,
        message: "You have successfully registered",
        user: req.user,
      });
  } else {
    res.status(401).json({
      error: true,
      message: "Registration failed",
    });
  }
});

router.get("/register/failed", (req, res) => {
  throw new ApiError(401, "OAuth login failure");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/oauth/register/failed",
  }),
  (req, res) => {
    // console.log(req);

    if (req.user) {
      console.log("The user is:", req.user[0]);
      const googleAuthToken = jwt.sign(
        { googleAuthToken: req.user[0]?.googleId },
        "123asdsas",
        { expiresIn: 860000 }
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      res.cookie("googleAuthToken", googleAuthToken, options);

      res.redirect("http://localhost:5173");
    }
    // successRedirect: "/api/v1/oauth/register/success",
  }
);

export default router;
