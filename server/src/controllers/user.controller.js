import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const generateAccessAndRefreshTokens = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        reject(new Error("User not found"));
        return;
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      await user.save({ validateBeforeSave: false });

      const tokens = { accessToken, refreshToken };
      resolve(tokens);
    } catch (error) {
      reject(error);
    }
  });
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "-googleId -picture -accessToken -refreshToken -otp -otpExpires"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }
    // console.log("User not found");

    res.json(new ApiResponse(200, { user }, "User data found"));
    // console.log("User data found", user);
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch user data");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log("Failed to logout:", err);
        throw new ApiError(401, err?.message || "Failed to logout");
      }

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      };
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("userId", options)
        .clearCookie("user", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    });
  } catch (error) {
    console.log("Failed to logout:", error);
    throw new ApiError(401, error?.message || "Failed to logout");
  }
});

export {
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  userLogin,
  logoutUser,
};
