import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatar: { type: String },
    cartData: { type: Object, default: {} },
    active: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },
    // address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  { minimize: false }
);

const UserModel = mongoose.models.user || mongoose.model("User", UserSchema);

export default UserModel;
