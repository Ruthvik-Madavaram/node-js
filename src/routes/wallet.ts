import { Router } from 'express';
import isAuth from '../middleware/is-auth';
import { createWallet, getWallet } from '../controllers/wallet';
import { body } from 'express-validator/src';

const router = Router();

router.get('/', isAuth, getWallet);

router.post('/create',[
    body('name')
      .trim()
      .isLength({ min: 5 }),
    body('balance')
      .isNumeric()
      .withMessage('Amount must be a numeric value')
      .custom(value => {
        if (value <= 25000) {
          throw new Error('Amount must be greater than 25000');
        }
        return true;
      })
  ] ,isAuth , createWallet);

export default router;