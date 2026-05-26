import express from 'express';
import {
  getAuctions,
  getAuction,
  createAuction,
  getFeaturedAuctions,
  getCategories,
  updateAuctionImages,
  getMyAuctions
} from '../controllers/auctionController.js';
import protect, { restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/me', protect, restrictTo('seller', 'admin'), getMyAuctions);
router.get('/:id', getAuction);
router.post('/', protect, restrictTo('seller', 'admin'), createAuction);
router.put('/:id/images', protect, restrictTo('seller', 'admin'), updateAuctionImages);

export default router;
