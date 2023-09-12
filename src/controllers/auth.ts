import { validationResult } from 'express-validator/src';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user';
import { RequestHandler } from 'express';
import { ErrorObject } from '../app';
import jwt from 'jsonwebtoken';

export const signup: RequestHandler = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.') as ErrorObject;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const email = req.body.email;
        const userName = req.body.userName;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword,
            userName: userName
        });
        const newUser = await user.save();
        res.status(201).json({ message: 'User created!', userId: newUser._id });
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const login: RequestHandler = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.') as ErrorObject;
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!') as ErrorObject;
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: token, userId: user._id.toString() });
    }catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
