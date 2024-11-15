import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req,res,next) => {

    // this gives us the access to the accessToken cookies that are with the user
    const token = req.cookies.accessToken || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }

    // if the token is there
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;

    res.json(new ApiResponse(200, null, "User Authenticated"))

    next();
    
})