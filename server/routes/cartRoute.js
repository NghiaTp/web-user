import express from 'express'
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js'
import authMiddleWare from '../middleware/auth.js';

const CartRouter = express.Router();

CartRouter.post("/add",authMiddleWare, addToCart)
CartRouter.post("/remove",authMiddleWare, removeFromCart)
CartRouter.post("/get",authMiddleWare, getCart)

export default CartRouter;