import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessfullPassword } from "../utils/mailTrap/emails.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
  
      const user = await User.findById(userId) // trying to find that specific user in the db
      const accessToken = user.generateAccessToken() // this will store the access token
      const refreshToken = user.generateRefreshToken()
  
      user.refreshToken = refreshToken // in the user variable, write the value inside the refresh token field
      await user.save( {validateBeforeSave: false} ) // save the refresh token in the user db because it will be needed repeatedly to generate access token
  
      return {accessToken, refreshToken}
  
    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {username, email, password} = req.body;

    // check if any field is empty for not
    if(!username || !email || !password){
        throw new ApiError(400, "All fields are required");
    }

    // check if the user already exists based on email
    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(409, "User with the same email already exists")
    }

    // take the user password and encrypt it using the bcrypt library
    const hashedPassword = await bcrypt.hash(password, 10);

    // we also need a verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(verificationToken)
    const verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // this is equal to 15 minutes

    // now create the final user data to save in the database
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt
    })

    // I want that the user should be automatically logged in when the user registers
    // take the user's access and refresh token and save the refresh token to the db
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save( {validateBeforeSave: false})

    // Set cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    // email verification
    const mailResponse = await sendVerificationEmail(user.email, verificationToken);

    if(!mailResponse){
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }
    

    // return a repsonse that shows the user is logged in and send access cookies
    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200,
            {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                },
                accessToken,
                refreshToken
            },
            "User registered and logged in successfully"
        )
    )
})

const verifyEmail = asyncHandler(async (req,res) => {

    const { code } = req.body;

    // check if the code is there or not
    if(!code){
        throw new ApiError(400, "Verification code is required");
    }

    // find the user from the verification code
    const user = await User.findOne({ verificationToken: code });

    if(!user){
        throw new ApiError(400, "Invalid or expired verification code");
    }

    // check if the verification code has expired or not
    if(Date.now() > user.verificationTokenExpiresAt){
        throw new ApiError(400, "Verification token has expired");
    }

    // make the user verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();

    await sendWelcomeEmail(user.email, user.username)

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"))

})

const loginUser = asyncHandler(async (req, res) => {

    // get the user data
    const {email, password} = req.body;

    // find the user
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400, "Invalid credentials");
    }

    // check if the password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Wrong password");
    }

    // generate access and refresh token for that user
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);


    // update the last login details of the user
    user.lastLogin = Date.now();
    user.save();

    // send the access token and refresh token to user user in cookies
    const loggedInUser = await User.findById(user._id).select("-password -accessToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      }, "User Logged In Successfully")
    )

})

const logoutUser = asyncHandler(async (req,res) => {

    await User.findByIdAndUpdate(req.user._id,
      {
        $set: {refreshToken: undefined}
      },
        { new: true }
    )
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
  
})

const forgotPassword = asyncHandler(async (req,res) => {

    const { email } = req.body;

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "User not found")
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000 // this is 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiredAt;

    await user.save();

    // send email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await sendPasswordResetEmail(email, resetLink);

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset link send to your email"))

})

const resetPassword = asyncHandler(async (req,res) => {

    // to get the thing in the URL that is after the "/" symbol, we use req.params
    const { token } = req.params;
    const { password } = req.body;

    // find the user in the db based on that token
    const user = await User.findOne({resetPasswordToken: token});

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    // check if the token is expired or not
    if(Date.now() > user.resetPasswordExpiresAt){
        throw new ApiError(400, "Reset token has expired")
    }

    // compare the new password with the old password
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        throw new ApiError(400, "New password cannot be the same as old password")
    }

    // if all the things are correct, then reset the password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined; // clear the reset token
    user.resetPasswordExpiresAt = undefined; // clear the expiration date

    await user.save();

    // send email for confirmation that password has been reset
    await sendResetSuccessfullPassword(user.email);

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Password has been reset successfully"))

})

export { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword };