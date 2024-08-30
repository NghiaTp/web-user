import mongoose, { Schema } from "mongoose";

const ColorSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true},
    color: {type: String, require: true}
})

const ColorModel = mongoose.model("Color", ColorSchema);

export default ColorModel;