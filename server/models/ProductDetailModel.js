import mongoose, { Schema } from "mongoose";

const ProductDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  ram: { type: String, require: true },
  rom: { type: String, require: true },
  card: { type: String, require: true },
  chip: { type: String, require: true },
  display: { type: String, require: true },
  pin: { type: String, require: true },
  display_size: { type: String, require: true },
  operating_system: { type: String, require: true },
  camera: { type: String, require: true },
});

const ProductDetailModel = mongoose.model("ProductDetail", ProductDetailSchema);

export default ProductDetailModel;
