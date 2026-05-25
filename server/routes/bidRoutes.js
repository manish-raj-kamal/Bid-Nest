import express from 'express';
import { placeBid, getAuctionBids } from '../controllers/bidController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, placeBid);
router.get('/:auctionId', getAuctionBids);

export default router;
