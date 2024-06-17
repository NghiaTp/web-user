import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
    const{email,password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "Email không tồn tại!"})
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success: false, message: "Mật khẩu bạn nhập không đúng!"})
        }

        const token = createToken(user._id);
        res.json({success: true, token})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Login failed!"})
    }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  try {
    // check user already
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email đã tồn tại!" });
    }

    // validate email & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email của bạn không đúng!" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message: "Mật khẩu phải có chữ thường, hoa, số và ký tự đặc biệt!",
      });
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name,
      phone: phone,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    console.error("Error registering user:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
