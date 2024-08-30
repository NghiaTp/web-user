import mongoose, { Schema } from "mongoose";

const OrderDetailSchema = new mongoose.Schema({
    voucher: {type: mongoose.Schema.Types.ObjectId, ref: 'Voucher'},
    quantity: {type: Number, default: 1},
    price: {type: Number, required: true},
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    classification: {type: mongoose.Schema.Types.ObjectId, ref: 'Classsification', require: true}
})  

const OrderDetailModel = mongoose.model("OrderDetail", OrderDetailSchema);

export default OrderDetailModel;