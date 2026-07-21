import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Global cache for Next.js/serverless to prevent duplicate connections
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Validate MONGODB_URI is provided
    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }

    // Return existing connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // Return in-flight promise if connection is being established
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    // Await and cache the connection
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;