import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";
import AddressModel from "../models/AddressModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const fontend_url = "http://localhost:5173";
  try {
    const newOrder = new OrderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await UserModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const shippingCost =
      req.body.amount > 500000 ? 0 : Math.round(2 * 100 * 80);

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.salePrice > 0 ? Math.round(item.salePrice) : Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Phí vận chuyển",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${fontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${fontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Có lỗi xảy ra!" });
  }
};

const placeOrderForMobile = async (req, res) => {
  try {
    const { userId, items, amount, address, payment } = req.body;

    const newOrder = new OrderModel({
      userId,
      items,
      amount,
      address,
      payment: true
    });
    await newOrder.save();
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    const shippingCost = amount > 500000 ? 0 : Math.round(2 * 100 * 80);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount) + shippingCost,
      payment_method_types: ["card"],
      currency: "vnd",
      metadata: { orderId: newOrder._id.toString() },
    });



    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Có lỗi xảy ra!" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Đã thanh toán" });
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Chưa thanh toán" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Thanh toán xảy ra lỗi!" });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId, status } = req.body;
    let query = { userId };

    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await OrderModel.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("Error: ", error);
    res.json({ success: false, message: "Lấy danh sách thất bại" });
  }
};
const listOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi lấy danh sách!" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await OrderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Update thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Lỗi" });
  }
};

const statisticalOrderByDay = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const matchStage = {
      cancel: false
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const statistics = await OrderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(statistics);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching daily order statistics",
      error: error.message,
    });
  }
};

const statisticalOrderByMonth = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const matchStage = {
      cancel: false
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const statistics = await OrderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(statistics);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching monthly order statistics",
      error: error.message,
    });
  }
};

const statisticalOrderByYear = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const matchStage = {
      cancel: false
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const statistics = await OrderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(statistics);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching yearly order statistics",
      error: error.message,
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {cancel: false};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const topProducts = await OrderModel.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalOrders: { $sum: "$items.quantity" },
          totalAmount: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          imageUrl: { $first: "$items.images" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalOrders: 1,
          totalAmount: 1,
          imageUrl: 1,
        },
      },
    ]);

    res.json({ success: true, data: topProducts });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Lấy danh sách sản phẩm bán chạy thất bại",
    });
  }
};

const payExistingOrder = async (req, res) => {
  const fontend_url = "http://localhost:5173";
  const { orderId } = req.params;

  try {
    // Tìm đơn hàng dựa trên orderId
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Đơn hàng không tồn tại" });
    }

    if (order.payment) {
      return res
        .status(400)
        .json({ success: false, message: "Đơn hàng đã được thanh toán" });
    }

    const shippingCost = order.amount > 500000 ? 0 : Math.round(2 * 100 * 80); 

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.salePrice > 0 ? Math.round(item.salePrice) : Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Phí vận chuyển",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${fontend_url}/verify?success=true&orderId=${orderId}`,
      cancel_url: `${fontend_url}/verify?success=false&orderId=${orderId}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra!" });
  }
};

const createOrderCash = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { userId, items, amount } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId không được cung cấp." });
    }

    console.log("Searching for address with user:", userId);
    const address = await AddressModel.findOne({ user: req.userId });

    if (!address) {
      console.log("No address found for user:", userId);
      return res.status(404).json({
        success: false,
        message: "Địa chỉ không tồn tại cho người dùng này.",
      });
    }

    console.log("Found address:", address);

    const newOrder = new OrderModel({
      userId,
      items,
      amount,
      address: {
        address: address.address,
        fullname: address.fullname,
        phone: address.phone,
      },
      payment: true,
      type: "Trực tiếp",
    });

    await newOrder.save();
    console.log("New order saved:", newOrder);

    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Đơn hàng đã được tạo thành công với thanh toán tiền mặt.",
    });
  } catch (error) {
    console.error("Error in createOrderCash:", error);
    res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi tạo đơn hàng." });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (order.cancel) {
      return res.status(400).json({ success: false, message: "Đơn hàng đã được hủy trước đó" });
    }

    order.cancel = true;
    order.status = "Đã hủy";
    await order.save();

    res.json({ success: true, message: "Đơn hàng đã được hủy thành công" });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi hủy đơn hàng" });
  }
};

const listCancelledOrders = async (req, res) => {
  try {
    const cancelledOrders = await OrderModel.find({ cancel: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: cancelledOrders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng đã hủy:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách đơn hàng đã hủy" });
  }
};

const getOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findById(orderId).populate('userId', 'name email').exec();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy thông tin đơn hàng' });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  placeOrderForMobile,
  statisticalOrderByDay,
  statisticalOrderByMonth,
  statisticalOrderByYear,
  getTopSellingProducts,
  payExistingOrder,
  createOrderCash,
  cancelOrder,
  listCancelledOrders,
  getOrderDetail
};
