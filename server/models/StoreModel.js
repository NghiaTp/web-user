import mongoose, {Schema} from 'mongoose'

const StoreSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    image: {type: String, required: true},
});

const StoreModel = mongoose.model("Store", StoreSchema);

export default StoreModel