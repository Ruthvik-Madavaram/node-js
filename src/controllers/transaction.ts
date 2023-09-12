import { validationResult } from 'express-validator/src';
import { NextFunction, Response } from "express";
import { ErrorObject, IRequest } from "../app";
import Wallet from "../models/wallet";
import User from "../models/user";
import Transaction, { TransactionType } from '../models/transaction';
import Crypto from '../models/crypto';

export const getTransactions: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try{
        const transactions = await Transaction.find();
        res.status(200).json({ transactions });
    }catch(err: any){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const buyCrypto: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try{
        const quantity = req.body.quantity;
        const userId = req.userId;
        const walletId = req.body.walletId;
        const cryptoId = req.body.cryptoId;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.') as ErrorObject;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const user = await User.findById(req.userId);

        if(!user){
            const error = new Error("User not found") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }

        const crypto = await Crypto.findById(cryptoId);
        if(!crypto){
            const error = new Error("Crypto coin your trying to buy doesnot exists") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const price = crypto.price

        const wallet = await Wallet.findById(walletId);
        if(!wallet) {
            const error = new Error('No wallet found') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        if(wallet.balance < (+price)*(+quantity)) {
            const error = new Error('You dont have sufficient balance to buy this crypto') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }

        const transaction = new Transaction({
            price,
            quantity,
            transactionType: TransactionType.BUY,
            userId,
            cryptoId,
            walletId
        });

        wallet.balance = wallet.balance - (+price)*(+quantity);
        wallet.cryptoCurrencyBalance += (+price)*(+quantity);
        await wallet.save();
        const newTransaction = await transaction.save();
        res.status(201).json({ transaction: newTransaction });
    }catch(err: any){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const sellCrypto: any = async (req: IRequest, res: Response, next: NextFunction) => {
    try{
        const quantity = req.body.quantity;
        const userId = req.userId;
        const walletId = req.body.walletId;
        const cryptoId = req.body.cryptoId;

        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error("User not found") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const crypto = await Crypto.findById(cryptoId);
        if(!crypto){
            const error = new Error("Crypto coin your trying to buy doesnot exists") as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        const price = crypto.price
        const wallet = await Wallet.findById(walletId);
        if(!wallet) {
            const error = new Error('No wallet found') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }
        if(wallet.cryptoCurrencyBalance < (+price)*(+quantity)) {
            const error = new Error('You dont have sufficient crypto balance to sell this crypto') as ErrorObject;
            error.statusCode = 404;
            throw error;
        }

        const transaction = new Transaction({
            price,
            quantity,
            transactionType: TransactionType.SELL,
            userId,
            cryptoId,
            walletId
        });

        wallet.balance = wallet.balance + (+price)*(+quantity);
        wallet.cryptoCurrencyBalance -= (+price)*(+quantity);
        await wallet.save();
        const newTransaction = await transaction.save();
        res.status(201).json({ transaction: newTransaction });
    }catch(err: any){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
