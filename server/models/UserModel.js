import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  name: {type: String, require: true},
  phone :{type : String, require: true},
  email : {type: String, require: true, unique : true},
  password : {type : String, require: true},
  role : {type : String, require: true},
  cartData: {type: Object,default:{}}

},{minimize:false});

const UserModel = mongoose.models.user || mongoose.model("User", UserSchema);

export default UserModel;