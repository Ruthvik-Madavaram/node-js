import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import watchlistRoutes from './routes/watchlist';
import walletRoutes from './routes/wallet';
import transactionRoutes from './routes/transaction';
import { ValidationError } from 'express-validator/src';
import { Request, Response, NextFunction } from 'express';
import Crypto from './models/crypto';

export interface ErrorObject extends Error{
  statusCode: number;
  data: ValidationError[];
}

export interface IRequest extends Request{
  userId: string;
}

const app = express();

app.use(bodyParser.json());

app.get('/crypto', (req, res, next) => {
  Crypto.find({})
        .then(cryptos => {
          res.status(200).json({ cryptos });
        })
        .catch(err => {
          if (!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
        })
});

app.use('/auth', authRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/wallet', walletRoutes);
app.use('/transaction', transactionRoutes);

app.use((error: ErrorObject, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://ruthvikmadavaram:vJMtlSYUONMEFh74@cluster0.yem7jn6.mongodb.net/minet?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
  