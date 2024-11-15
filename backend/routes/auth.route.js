import { Router } from "express";
import { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.route("/check-auth").get(verifyJWT)

router.route("/register").post(registerUser)
router.route("/verify-email").post(verifyEmail)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)

export default router;