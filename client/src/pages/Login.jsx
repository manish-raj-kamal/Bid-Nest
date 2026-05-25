import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          setLoading(true);
          setError('');
          await googleLogin(response.credential);
          navigate('/');
        } catch (err) {
          setError(err.message || 'Google login failed');
        } finally {
          setLoading(false);
        }
      },
    });

    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 400,
        text: 'signin_with',
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
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
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Welcome back</h1>
          <p className="text-text-secondary mt-2">Sign in to your account to continue bidding</p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 shadow-soft-lg">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-bg-primary text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20 accent-accent" />
                <span className="text-xs text-text-secondary">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-accent transition-colors hover:text-accent-dark"
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark shadow-soft hover:shadow-soft-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-xs text-text-secondary uppercase tracking-widest">or</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="mt-4" ref={googleBtnRef}></div>
        </div>

        <p className="text-center mt-8 text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent-dark transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
