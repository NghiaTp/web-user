import mongoose, { Schema } from "mongoose";

const AddressSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    address: {type: String, required: true},
    fullname: {type: String, required: true},
    phone: {type: String, required: true}
})

const AddressModel = mongoose.model('Address', AddressSchema);

export default AddressModel;