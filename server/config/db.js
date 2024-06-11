import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017')
        .then(() => console.log("DB connected"));
    } catch (error) {
        console.log(error);
    }
}   