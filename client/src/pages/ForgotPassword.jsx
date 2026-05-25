import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/auth';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('OTP sent to your email.');
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/[0.03] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L8 16H14V28L24 16H18V4Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              Bid<span className="text-accent">Nest</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Reset Password</h1>
          <p className="text-text-secondary mt-2">
            {step === 'email' ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 shadow-soft-lg">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark shadow-soft hover:shadow-soft-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    autoComplete="one-time-code"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300 font-mono tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark shadow-soft hover:shadow-soft-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-xs font-semibold text-accent transition-colors hover:text-accent-dark"
                >
                  Back to email step
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-text-secondary">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-accent hover:text-accent-dark transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
