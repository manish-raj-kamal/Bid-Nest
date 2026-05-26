import express from 'express';
import {
  getAuctions,
  getAuction,
  createAuction,
  getFeaturedAuctions,
  getCategories,
} from '../controllers/auctionController.js';
import protect, { restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/:id', getAuction);
router.post('/', protect, restrictTo('seller', 'admin'), createAuction);

export default router;
