import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import connectDB from "../db/connect.js";

const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    // console.log(req.cookies);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const pool = await connectDB();
    const user = await pool?.query("SELECT * FROM user WHERE id = ?", [
      decoded?.id,
    ]);

    if (!user || user.length == 0) {
      throw new ApiError(401, "Unauthorized: Invalid token");
    }
    req.user = user[0];
    // console.log(user[0]);

    console.log("Auth Middleware Successfull");
    next();
  } catch (error) {
    throw new ApiError(500, "Server Error: Authentication failed");
  }
});

export default authMiddleware;
