import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String, require: true },
  category: { type: String, require: true },
  brand: { type: String, require: true },
});

const ProductModel = mongoose.model("product", ProductSchema);

export default ProductModel;