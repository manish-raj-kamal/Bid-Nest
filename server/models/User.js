import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: function() { return !this.googleId; },
      minLength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// TTL Index to delete unverified users when their registration OTP expires
userSchema.index(
  { otpExpiry: 1 },
  { expireAfterSeconds: 0 }
);

const User = mongoose.model('User', userSchema);

export default User;
