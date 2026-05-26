import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  verifyOtp, 
  resendOtp, 
  googleLogin, 
  forgotPassword, 
  resetPassword,
  getUserStats,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
} from '../controllers/userController.js';
import protect, { restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/me/password', protect, changePassword);
router.get('/stats', protect, restrictTo('admin'), getUserStats);
router.get('/', protect, restrictTo('admin'), getAllUsers);
router.get('/:id', protect, restrictTo('admin'), getUserById);
router.put('/:id/role', protect, restrictTo('admin'), updateUserRole);

export default router;
