import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  status: {
    type: String,
    enum: ["Giảm giá", "Còn bán", "Ngưng bán"],
    default: "Còn bán",
  },
  images: [
    {
      filename: { type: String },
      originalName: { type: String },
    },
  ],
  specifications: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductDetail",
  },
  salePrice: { type: Number },
  discountPercentage: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  numberOfReviews: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
