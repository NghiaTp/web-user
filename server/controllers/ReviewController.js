import ReviewModel from "../models/ReviewModel.js";
import ProductModel from "../models/ProductModel.js";

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.body.userId;
    console.log(userId);
    

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await ReviewModel.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    const newReview = new ReviewModel({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    await newReview.save();

    // Cập nhật thông tin đánh giá trong sản phẩm
    await updateProductRating(productId);

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error in createReview:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo đánh giá" });
  }
};

const updateProductRating = async (productId) => {
  try {
    const reviews = await ReviewModel.find({ product: productId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      $set: {
        averageRating: avgRating,
        numberOfReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error in updateProductRating:", error);
    throw error;
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ product: productId }).populate(
      "user",
      "name avatar"
    );
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy đánh giá" });
  }
};

export { createReview, getProductReviews };
