import { Router } from 'express';
import { buyCrypto, sellCrypto, getTransactions } from '../controllers/transaction';
import isAuth from '../middleware/is-auth';
import { body } from 'express-validator/src';

const router = Router();

router.get("/", isAuth, getTransactions)

router.post('/buy', [
    body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a numeric value')
], isAuth, buyCrypto);

router.post('/sell', isAuth, sellCrypto);

export default router;