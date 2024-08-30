import { createReview, getProductReviews } from '../controllers/ReviewController.js'
import express from 'express'
import authMiddleware from "../middleware/auth.js";

const ReviewRouter = express.Router();

ReviewRouter.post('/review-product', authMiddleware, createReview);
ReviewRouter.get('/review-list/:productId', getProductReviews);

export default ReviewRouter;