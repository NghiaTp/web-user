import express from "express";
import { sendOtp, resetPassword, changePassword } from "../controllers/authController.js";

const router = express.Router();

// Route để gửi OTP
router.post("/send-otp", sendOtp);

// Route để đặt lại mật khẩu bằng OTP
router.post("/reset-password", resetPassword);

// Route để đổi mật khẩu bằng mật khẩu cũ
router.post("/change-password", changePassword);

export default router;
