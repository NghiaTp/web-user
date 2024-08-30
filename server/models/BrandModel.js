import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
})

const BrandModel = mongoose.model('Brand', BrandSchema);

export default BrandModel;