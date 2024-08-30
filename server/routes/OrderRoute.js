import {
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
} from "../controllers/OrderController.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/place-mobile", authMiddleware, placeOrderForMobile)
orderRouter.post("/verify-order", verifyOrder);
orderRouter.post("/user-orders", authMiddleware, userOrders);
orderRouter.get("/list-orders", listOrders)
orderRouter.post('/update-status', updateStatus)
orderRouter.get('/statistical-order-by-day', statisticalOrderByDay);
orderRouter.get('/statistical-order-by-month', statisticalOrderByMonth);
orderRouter.get('/statistical-order-by-year', statisticalOrderByYear);
orderRouter.get('/get-top', getTopSellingProducts);
orderRouter.post('/pay/:orderId', payExistingOrder);
orderRouter.post('/cash/order', createOrderCash);
orderRouter.post('/cancel-order/:orderId', cancelOrder);
orderRouter.get('/list-cancel-order', listCancelledOrders)
orderRouter.get('/:orderId', getOrderDetail);

export default orderRouter;
