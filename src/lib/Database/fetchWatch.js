import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

// Middleware to connect to MongoDB
async function fetchWatchMiddleware() {
    let isConnected = false;
    console.log(process.env.MONGODB_URI)
    if(!isConnected){
        try {
            console.log("try to connect DB")
            const db = await mongoose.connect(process.env.MONGODB_URI);
            isConnected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error; // Rethrow the error to handle it in the caller function
        }
    }

}



export default fetchWatchMiddleware;