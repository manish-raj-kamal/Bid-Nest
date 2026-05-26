import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/auth';
import Button from './ui/Button';

const navLinks = [
  { name: 'Auctions', href: '/auctions' },
  { name: 'Categories', href: '/#categories' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(href.replace('/', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(href.replace('/', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-border/60 bg-white/90 shadow-soft backdrop-blur-2xl'
            : 'bg-white/70 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-soft transition-shadow duration-300 group-hover:shadow-soft-md">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L8 16H14V28L24 16H18V4Z" fill="white" />
                </svg>
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">
                Bid<span className="text-accent">Nest</span>
              </span>
            </Link>

            {/* Center Nav */}
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-white/75 p-1 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  type="button"
                  className="rounded-md px-3.5 py-2 text-sm font-semibold text-text-secondary transition-colors duration-200 hover:bg-bg-secondary hover:text-text-primary"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate('/auctions')}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-all duration-200 hover:bg-border-light hover:text-text-primary"
                aria-label="Search auctions"
                title="Search auctions"
              >
                <Search className="w-[18px] h-[18px]" />
              </motion.button>

              {user ? (
                <>
                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <Button variant="secondary" size="sm" onClick={() => navigate('/create-auction')}>
                      <Plus className="w-4 h-4" /> Create
                    </Button>
                  )}
                  {user?.role === 'admin' && (
                    <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                      Admin
                    </Button>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-3 py-1.5 hover:border-accent/30 transition-colors">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-text-primary max-w-[80px] truncate">{user.name}</span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { logout(); navigate('/'); }}
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Sign Up</Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-border-light lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 top-16 z-40 border-b border-border bg-white/95 shadow-soft-lg backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-5 sm:px-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  type="button"
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                >
                  {link.name}
                </button>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent"
                >
                  Admin
                </Link>
              )}
              <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate('/create-auction'); }}>
                        Create Auction
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate('/login'); }}>Log In</Button>
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => { setMobileOpen(false); navigate('/signup'); }}>Sign Up</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
