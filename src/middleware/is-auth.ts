import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorObject, IRequest } from '../app';

const isAuth: any = (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.') as ErrorObject;
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken: jwt.JwtPayload;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret') as jwt.JwtPayload;
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.') as ErrorObject;
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

export default isAuth;