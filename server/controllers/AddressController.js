import AddressModel from "../models/AddressModel.js";

const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address, fullname, phone } = req.body;
    console.log(userId);

    const newAddress = new AddressModel({
      user: userId,
      address: address,
      fullname: fullname,
      phone: phone
    });

    await newAddress.save();

    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    res
      .status(500)
      .json({
        message: "Đã xảy ra lỗi khi thêm địa chỉ",
        error: error.message,
      });
  }
};

const getUserAddress = async (req, res) => {
  try {
    const userId = req.userId;
    // Lấy các địa chỉ của người dùng
    const addresses = await AddressModel.find({ userId });
    console.log(addresses);


    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch addresses",
        error: error.message,
      });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { address, fullname, phone } = req.body;

    // Tìm địa chỉ và cập nhật thông tin
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { address, fullname, phone },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, data: updatedAddress });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật địa chỉ",
        error: error.message,
      });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Tìm và xóa địa chỉ
    const deletedAddress = await AddressModel.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Đã xảy ra lỗi khi xóa địa chỉ",
        error: error.message,
      });
  }
};

export { addAddress, getUserAddress, updateAddress, deleteAddress };
