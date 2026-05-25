import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'md', icon, className = '', type = 'button', ...props }) => {
  const base = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg font-semibold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

  const variants = {
    primary: 'bg-accent text-white shadow-soft hover:bg-accent-dark hover:shadow-soft-md',
    secondary: 'border border-border bg-white text-text-primary shadow-soft hover:border-accent/30 hover:bg-accent-light/40',
    ghost: 'bg-transparent text-text-primary hover:bg-border-light',
    outline: 'border border-accent bg-transparent text-accent hover:bg-accent hover:text-white',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
};

export default Button;
