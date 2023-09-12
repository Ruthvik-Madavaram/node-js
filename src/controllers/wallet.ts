import { validationResult } from 'express-validator/src';
import { NextFunction, Response } from "express";
import { ErrorObject, IRequest } from "../app";
import Wallet from "../models/wallet";
import User from "../models/user";

export const getWallet: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error("User not found") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const wallets = await Wallet.find({ userId: user._id });
        if(!wallets){
            const error = new Error("There are no wallets for this user") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ wallets });
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
};

export const createWallet: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.') as ErrorObject;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const newWallet = new Wallet({
            name: req.body.name,
            balance: req.body.balance,
            userId: req.userId
        })
        const wallet = await newWallet.save();
        res.status(201).json({ message: "wallet created successfully!", wallet });
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
};
