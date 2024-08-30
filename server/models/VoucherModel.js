import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    price: {type: Number, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    image: {type: String, required: true}
}, {timestamps: true})

const VoucherModel = mongoose.model("Voucher", VoucherSchema);

export default VoucherModel;