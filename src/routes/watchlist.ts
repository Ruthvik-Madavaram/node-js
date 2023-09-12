import { Router } from 'express';
import { addToWatchlist, removeFromWatchlist } from '../controllers/watchlist';
import isAuth from '../middleware/is-auth';

const router = Router();

router.post('/:cryptoId',isAuth, addToWatchlist);

router.delete('/:cryptoId',isAuth, removeFromWatchlist);

export default router;