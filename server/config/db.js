import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ducpvps26267:soldout@database1.4wi40ec.mongodb.net/?retryWrites=true&w=majority&appName=database1')
        .then(() => console.log("DB connected"));
    } catch (error) {
        console.log(error);
    }
}   