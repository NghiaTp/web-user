import UserModel from "../models/UserModel.js";
import AddressModel from "../models/AddressModel.js";

// lấy danh sách user
const getUserList = async (req, res) => {
  try {
    const users = await UserModel.find({ role: "user" });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// thay đổi trạng thái user
const changeUserStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.active = !user.active;
    await user.save();
    res.json({ message: "user status updated", user });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export { getUserList, changeUserStatus };
