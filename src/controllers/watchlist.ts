import { Response, NextFunction } from 'express';
import { ErrorObject, IRequest } from '../app';
import Crypto from '../models/crypto';
import User from '../models/user';
import mongoose from 'mongoose';

export const addToWatchlist: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try{
        const cryptoId = req.params.cryptoId;
        const crypto = await Crypto.findById(cryptoId);
        if(!crypto){
            const error = new Error('This Crypto coin doesnot exists.') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }

        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error('User doesnot exist.') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const found = user.watchlist.find(cid => cid.equals(new mongoose.Types.ObjectId(cryptoId)));
        if(found){
            const error = new Error('Already added to watchlist.') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        user.watchlist.push(new mongoose.Types.ObjectId(cryptoId));
        await user.save();

        res.status(201).json({
            message: `${crypto.coinCode} added to watchlist`,
        });
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export const removeFromWatchlist: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try{
        const cryptoId = req.params.cryptoId;
        const crypto = await Crypto.findById(cryptoId);
        if(!crypto){
            const error = new Error('This Crypto coin doesnot exists.') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }

        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error('User doesnot exist.') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const updatedWatchList = user.watchlist.filter(cid => !cid.equals(new mongoose.Types.ObjectId(cryptoId)));
        user.watchlist = updatedWatchList;
        await user.save();

        res.status(200).json({
            message: `${crypto.coinCode} removed from watchlist`,
        })
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
