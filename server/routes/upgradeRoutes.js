import express from 'express';
import {
  createRequest,
  getMyRequest,
  getAllRequests,
  handleRequest,
} from '../controllers/upgradeController.js';
import protect, { restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, restrictTo('bidder'), createRequest);
router.get('/me', protect, getMyRequest);
router.get('/', protect, restrictTo('admin'), getAllRequests);
router.put('/:id', protect, restrictTo('admin'), handleRequest);

export default router;
