import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  verifyOtp, 
  resendOtp, 
  googleLogin, 
  forgotPassword, 
  resetPassword 
} from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;
