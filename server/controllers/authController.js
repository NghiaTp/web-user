import User from "../models/UserModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Hàm để tạo OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60000);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, phone, otp, otpExpires });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Cấu hình email sẽ được gửi
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    // Gửi email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "OTP sent successfully" , success: true});
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending OTP" });
    }
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ error: "Error processing OTP request" });
  }
};

// Đặt lại mật khẩu bằng OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body; // Lấy email, OTP và mật khẩu mới từ yêu cầu của client

  try {
    const user = await User.findOne({ email });

    // Kiểm tra xem user có tồn tại không
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Kiểm tra xem OTP có khớp và chưa hết hạn không
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới và xóa OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save(); // Lưu thông tin user

    res.status(200).json({ message: "Password reset successfully" , success: true}); // Trả về thông báo thành công
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" }); // Trả về lỗi nếu có
  }
};

// Đổi mật khẩu bằng mật khẩu cũ
export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Error changing password" });
  }
};
