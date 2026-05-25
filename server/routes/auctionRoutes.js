import express from 'express';
import {
  getAuctions,
  getAuction,
  createAuction,
  getFeaturedAuctions,
  getCategories,
} from '../controllers/auctionController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/:id', getAuction);
router.post('/', protect, createAuction);

export default router;
