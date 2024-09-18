import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "../db/connect.js";
const db = await connectDB();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "/api/v1/oauth/google/callback",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
      accessType: "offline",
      // prompt: "consent",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(
          "OAUTH  GOOGLE STRATEGY, ---TOKENS:::::::",
          accessToken,
          refreshToken
        );

        const [existingUser] = await db.query(
          "SELECT * FROM user WHERE googleId = ?",
          [profile.id]
        );

        let user;
        if (existingUser.length > 0) {
          user = existingUser[0];
        } else {
          await db.query(
            "INSERT INTO user (googleId, full_name, userImg, email, accessToken, refreshToken) VALUES (?, ?, ?, ?, ?, ?)",
            [
              profile.id,
              profile.displayName,
              profile.photos[0].value,
              profile.emails[0].value,
              accessToken,
              refreshToken,
            ]
          );
          [user] = await db.query("SELECT * FROM user WHERE googleId = ?", [
            profile.id,
          ]);
        }

        // Update tokens if necessary
        if (
          user.accessToken !== accessToken ||
          user.refreshToken !== refreshToken
        ) {
          await db.query(
            "UPDATE user SET accessToken = ?, refreshToken = ? WHERE googleId = ?",
            [accessToken, refreshToken, profile.id]
          );
        }

        return cb(null, user);
      } catch (err) {
        console.error("Error during OAuth process", err);
        return cb(err, false);
      }
    }
  )
);

export default passport;
