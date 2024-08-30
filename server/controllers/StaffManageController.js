import UserModel from "../models/UserModel.js";

// lấy danh sách user
const getStaffList = async (req, res) => {
    try {
        const staffs = await UserModel.find({role: 'staff'});
        res.json({success: true, data: staffs});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// thay đổi trạng thái staff
const changeStaffStatus = async (req, res) => {
    try {
        const staff = await UserModel.findById(req.params.userId);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        staff.active = !staff.active;
        await staff.save();
        res.json({ message: 'Staff status updated', staff });
    } catch (error) {
        res.status(500).json({message: err.message});
    }
};

export { getStaffList, changeStaffStatus };