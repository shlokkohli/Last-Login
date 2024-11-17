import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"

export const sendUserData = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    // Only send response here
    return res.json(new ApiResponse(200, {
        user
    }, "User data fetched successfully"))
});