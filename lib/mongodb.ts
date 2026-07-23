import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("The MONGODB_URI environment variable is not defined");
    }
    return mongoose.connect(MONGODB_URI);
}

export default connectDB;