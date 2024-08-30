import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Attempting to login user with email: ${email}`);
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ success: false, message: "Email không tồn tại!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu bạn nhập không đúng!" });
    }
    if (!user.active) {
      return res.json({
        success: false,
        message: "Tài khoản đã bị khóa, vui lòng liên hệ admin!",
      });
    }

    const token = createToken(user._id);
    console.log("Login successful, token generated");
    res.json({ success: true, token, data: user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed!" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  try {
    console.log(`Attempting to register user with email: ${email}`);
    const exists = await UserModel.findOne({ email });
    if (exists) {
      console.log("Email already exists");
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại!" });
    }

    if (!validator.isEmail(email)) {
      console.log("Invalid email format");
      return res
        .status(400)
        .json({ success: false, message: "Email của bạn không đúng!" });
    }
    if (!validator.isStrongPassword(password)) {
      console.log("Weak password");
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có chữ thường, hoa, số và ký tự đặc biệt!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    console.log("User registered successfully");
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);

    console.log("Received update request for user:", req.params.userId);
    console.log("Request body:", req.body);
    console.log("File:", req.file);
  } catch (error) {
    console.error("Error updating user profile:", error);
    console.error("Detailed error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Attempting to login admin with email: ${email}`);
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ success: false, message: "Email không tồn tại!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password");
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu bạn nhập không đúng!" });
    }
    if (!user.active) {
      return res.json({
        success: false,
        message: "Tài khoản đã bị khóa, vui lòng liên hệ admin!",
      });
    }

    if (user.role !== "admin" && user.role !== "staff") {
      console.log("Unauthorized role");
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền truy cập!" });
    }

    const token = createToken(user._id);
    console.log("Admin login successful, token generated");
    res.json({ success: true, token, data: user });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Login failed!" });
  }
};

export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  loginAdmin,
};
