import mongoose, { Schema } from "mongoose";

const PromotionSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    sale_price: {type: Number, required: true},
    discountPercentage: { type: Number, required: true }
})

const PromotionModel = mongoose.model("Promotion", PromotionSchema);

export default PromotionModel;