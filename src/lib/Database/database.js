import mongoose from "mongoose";


const watchSchema = new mongoose.Schema({
    name: String,
    prices: [new mongoose.Schema({
        price: Number,
        updatedAt: {
            type: Date,
            default: Date.now(),
        }
    })],
    stores: String,
    photos: String,
    watchsereis: String,
    latestUpdate: {
        type: Date,
        default: Date.now(),
    },
    webp: String
});

export const watchesss = mongoose.models.watchdata || mongoose.model('watchdata', watchSchema);
