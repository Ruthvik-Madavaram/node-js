import mongoose, { Schema, model } from 'mongoose';

export interface IWallet {
    _id: mongoose.Types.ObjectId;
    name: string;
    balance: number;
    cryptoCurrencyBalance: number;
    userId: mongoose.Types.ObjectId;
}

const walletSchema = new Schema<IWallet>({
    name: {
        type: String,
        required: true
    },
    balance: Number,
    cryptoCurrencyBalance: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default model('Wallet', walletSchema);