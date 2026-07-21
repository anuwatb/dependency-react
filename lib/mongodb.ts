import mongoose from "mongoose";

declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    };
}

const MONGODB_URI = process.env.MONGODB_URI;

// Cache connection for serverless environments
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;