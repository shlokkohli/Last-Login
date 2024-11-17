import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"

// middlewares/auth.middleware.js
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
      const token = req.cookies.accessToken || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

      if (!token) {
          throw new ApiError(401, "Unauthorized request")
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      const user = await User.findById(decodedToken._id).select("-password -refreshToken")

      if (!user) {
          throw new ApiError(401, "Invalid Access Token")
      }

      req.user = user;
      // Only call next(), don't send response here
      next();
      
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
  }
})