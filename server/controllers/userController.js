import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiry = () => {
  const expiryMinutes = parseInt(process.env.EMAIL_OTP_EXPIRY_MINUTES) || 10;
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

// @desc    Register a new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = (role === 'seller') ? 'seller' : 'bidder';

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists with this email' });
      } else {
        // User exists but unverified, update name and password, resend OTP
        user.name = name;
        user.password = password;
        user.role = userRole;
        user.otp = generateOTP();
        user.otpExpiry = getOtpExpiry();
        await user.save();
        
        await sendOtpEmail(user.email, user.otp, 'registration');
        return res.status(200).json({ message: 'OTP sent to email', email: user.email });
      }
    }

    const otp = generateOTP();
    const otpExpiry = getOtpExpiry();

    user = await User.create({ name, email, password, otp, otpExpiry, isVerified: false, role: userRole });
    
    await sendOtpEmail(user.email, user.otp, 'registration');

    res.status(201).json({ message: 'OTP sent to email', email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Registration OTP
// @route   POST /api/users/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found or already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend Registration OTP
// @route   POST /api/users/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found or already verified' });
    }

    user.otp = generateOTP();
    user.otpExpiry = getOtpExpiry();
    await user.save();

    await sendOtpEmail(user.email, user.otp, 'registration');

    res.status(200).json({ message: 'New OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email to log in', unverified: true, email: user.email });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Login
// @route   POST /api/users/google
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the ID token using google-auth-library
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // Link Google account to existing user
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        // If they hadn't verified email via password flow, verifying it now via Google
        user.isVerified = true; 
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isVerified: true,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed' });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = getOtpExpiry();
    await user.save();

    await sendOtpEmail(user.email, user.resetPasswordOtp, 'forgotPassword');

    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/users/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.resetPasswordOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Get platform stats for admin
// @route   GET /api/users/stats
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const { default: Auction } = await import('../models/Auction.js');
    const totalAuctions = await Auction.countDocuments();
    
    res.json({
      totalUsers,
      totalAuctions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile (name, avatar)
// @route   PUT /api/users/me
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/me/password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Google-only users don't have a password
    if (!user.password) {
      return res.status(400).json({ message: 'Your account uses Google Sign-In. Please set a password via Forgot Password.' });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isVerified: true })
      .select('name email avatar role createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email avatar role createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['bidder', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Role must be bidder or seller' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot change admin role' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
