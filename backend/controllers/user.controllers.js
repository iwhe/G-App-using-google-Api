import { query } from "express";
import connectDB from "../db/connect.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = function (id) {
  return jwt.sign(
    {
      id: id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = function (id) {
  return jwt.sign(
    {
      id: id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    console.log("GENERATE accessToken: ", accessToken);
    console.log("GENERATE refreshToken: ", refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access token and Refresh Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const user = req?.body;

  const { name, email, password } = user;
  const trimmedEmail = email?.trim();

  const pool = await connectDB();

  const hashedPassword = await bcrypt.hash(password, 8);
  console.log(hashedPassword);

  const checkUser = async () => {
    const query = "SELECT email FROM user where email = ?";
    try {
      const [result] = await pool?.query(query, [trimmedEmail]);

      console.log(result);

      if (result.length > 0) {
        console.log("User already exists!");
        throw new ApiError(409, "User already exists!");
      }

      await insertData();
    } catch (error) {
      throw new ApiError(501, "Error while checking user in db");
    }
  };

  const insertData = async () => {
    const sqlQuery =
      "INSERT INTO USER(full_name, email, password) VALUES (?,  ?, ?)";

    const values = [name, trimmedEmail, hashedPassword];

    try {
      const [result] = await pool.query(sqlQuery, values);

      if (result) {
        console.log("User created");
      }

      res
        .status(200)
        .json(new ApiResponse(200, result, "User Registered successfully"));
    } catch (error) {
      throw new ApiError(500, "Error while registering user", error);
    }
  };

  checkUser();
});

let options = {
  httpOnly: true,
  secure: true,
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  const trimmedEmail = email?.trim();

  const pool = await connectDB();

  const [user] = await pool?.query("SELECT * FROM USER WHERE email = ?", [
    trimmedEmail,
  ]);
  console.log(user);

  if (!user || user.length == 0) {
    throw new ApiError(404, "User not found in the database");
  }

  const matchPassword = await bcrypt.compare(password, user[0].password);

  if (!matchPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const id = user[0].id;
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: user[0],
          accessToken,
          refreshToken,
        },
        "Logged in Successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log("Current user", req.user[0]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user[0], "Current User fetched successfully")
    );
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  generateAccessAndRefreshToken,
};
