import UserModel from "../models/UserModel.js";

const addToCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.body.userId);
    if(!userData){
      return res.json({success: false, message: 'Không tìm thấy user'})
    }
    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await UserModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi thêm giỏ hàng" });
  }
};

const removeFromCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.body.userId);
        let cartData = userData.cartData;
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        await UserModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: 'Đã xóa khỏi giỏ hàng !'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Lỗi xóa sản phẩm khỏi giỏ hàng'});
    }
};

const getCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.body.userId);
        let cartData = userData.cartData;
        res.json({success:true, cartData})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Lỗi!'})
    }
};

export { addToCart, removeFromCart, getCart };
