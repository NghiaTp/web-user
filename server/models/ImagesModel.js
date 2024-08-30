import mongoose, {Schema} from "mongoose";

const ImagesSchema = new mongoose.Schema({
    filename: {type: String},
    originalName : {type: String},
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
})

const ImagesModel = mongoose.model("Images", ImagesSchema);
export default ImagesModel;