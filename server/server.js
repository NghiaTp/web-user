import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/ProductRoute.js";
import userRouter from "./routes/UserRoute.js";
import "dotenv/config";
import categoriesRouter from "./routes/CategoriesRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import storeRouter from "./routes/StoreRoute.js";
import orderDetailRouter from "./routes/OrderDetailRoute.js";
import ProductDetailRouter from "./routes/ProductDetailRoute.js";
import ReviewRouter from "./routes/ReviewRoute.js";
import voucherRouter from "./routes/VoucherRoute.js";
import colorRouter from "./routes/ColorRoute.js";
import AddressRouter from "./routes/AddressRoute.js";
import PromotionRouter from "./routes/PromotionRoute.js";
import CartRouter from "./routes/cartRoute.js";
import authRoute from "./routes/authRoute.js";
import UserManageRoute from './routes/UserManageRoute.js'
import StaffManageRouter from "./routes/StaffManageRoute.js";

//app config
const app = express();
const port = 8010;
const serverIp = "172.16.88.130"

//middleware
app.use(express.json());
app.use(cors());

//db connect
connectDB();

//api
app.use("/api/product", productRouter);
app.use("/images", express.static("uploads"));
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/order", orderRouter);
app.use("/api/store", storeRouter);
app.use("/api/order-detail", orderDetailRouter);
app.use("/api/product-detail", ProductDetailRouter);
app.use("/api/review", ReviewRouter);
app.use("/api/voucher", voucherRouter);
app.use("/api/color", colorRouter);
app.use("/api/address", AddressRouter);
app.use("/api/promotion", PromotionRouter);
app.use("/api/cart", CartRouter)
app.use("/api/auth", authRoute)
app.use("/api/user-manager", UserManageRoute)
app.use("/api/staff-manager", StaffManageRouter)

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, serverIp, () => {
    console.log(`Server started on http://${serverIp}:${port}`);
});

//mongodb+srv://ducpvps26267:soldout@database1.4wi40ec.mongodb.net/?retryWrites=true&w=majority&appName=database1
