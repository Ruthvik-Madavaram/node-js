import mongoose, { Schema, model } from 'mongoose';

export enum TransactionType {
    SELL = 'sell',
    BUY = 'buy'
}

interface ITransaction {
    _id: mongoose.Types.ObjectId;
    quantity: number;
    transactionType: keyof typeof TransactionType;
    userId: mongoose.Types.ObjectId;
    cryptoId: mongoose.Types.ObjectId;
    walletId: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>({
    quantity: Number,
    transactionType: {
        type: String,
        enum: Object.values(TransactionType),
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cryptoId: {
        type: Schema.Types.ObjectId,
        ref: 'Crypto'
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    }
}, {
    timestamps: true
});

export default model('Transaction', transactionSchema);