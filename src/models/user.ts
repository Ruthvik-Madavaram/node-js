import mongoose, { Schema, model } from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    userName: string;
    watchlist: mongoose.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    watchlist: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Crypto'
        }
    ]
});

export default model('User', userSchema);