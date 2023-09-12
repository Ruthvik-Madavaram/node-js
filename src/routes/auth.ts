import { Router } from 'express';
import User from "../models/user";
import { signup, login } from '../controllers/auth';
import { body } from 'express-validator/src';

const router = Router();

router.post('/signup',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('userName')
      .trim()
      .not()
      .isEmpty()
  ], signup);

router.post('/login', login);

export default router;