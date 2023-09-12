import mongoose, { Schema, model } from 'mongoose';

export interface ICrypto {
    _id: mongoose.Types.ObjectId;
    coinCode: string;
    price: number;
    marketCap: number;
    volume: number;
    circulatingSupply: number;
    change: number;
}

const cryptoSchema = new Schema<ICrypto>({
    coinCode: {
        type: String,
    },
    price: {
        type: Number,
    },
    marketCap: {
        type: Number,
    },
    volume: {
        type: Number,
    },
    circulatingSupply: {
        type: Number,
    },
    change: {
        type: Number,
    },
});

export default model('Crypto', cryptoSchema);