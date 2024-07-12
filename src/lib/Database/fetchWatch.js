import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false; // Move this outside the function to persist between function calls

async function fetchWatchMiddleware() {
    if (!isConnected) {
        try {
            console.log("Attempting to connect to MongoDB...");
            await mongoose.connect(process.env.MONGODB_URI);
            isConnected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    } else {
        console.log('MongoDB is already connected');
    }
}

export default fetchWatchMiddleware;
