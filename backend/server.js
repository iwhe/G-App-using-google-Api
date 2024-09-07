import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import oAuthRoutes from "./routes/oAuth.routes.js";
import authRoutes from "./routes/auth.routes.js";
import UserRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/oauth", oAuthRoutes);
app.use("/api/v1/user", UserRoutes);

export default app;
