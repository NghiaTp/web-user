import mongoose, {Schema} from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: {type: Array, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, default:Date.now},
    status: {type: String, default:'Chờ xác nhận'},
    address: {type: Object, required : true},
    payment: {type: Boolean, default: false},
    type: {type: String, default: 'ATM'},
    cancel: {type: Boolean, default: false}
}, {timestamps: true})

const OrderModel = mongoose.models.order || mongoose.model("Order", OrderSchema)

export default OrderModel;