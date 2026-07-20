import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function connectDB() {
    mongoose.connect(MONGODB_URI!).then((mongoose) => {
        return mongoose;
    });
}

export default connectDB;