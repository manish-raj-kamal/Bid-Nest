import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Camera, Users, TrendingUp, ShieldCheck } from 'lucide-react';

const stats = [
  { icon: Camera, number: 8000, suffix: '+', label: 'Live Auctions', display: '8K+' },
  { icon: Users, number: 60000, suffix: '+', label: 'Bidders', display: '60K+' },
  { icon: TrendingUp, number: 12000000, suffix: '+', label: 'Total Bids', display: '12M+' },
  { icon: ShieldCheck, number: 99.2, suffix: '%', label: 'Satisfaction', display: '99.2%' },
];

const AnimatedCounter = ({ target, suffix, display, isInView }) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView || done) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased);

      if (current >= steps) {
        clearInterval(timer);
        setDone(true);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, done, target]);

  if (done || !isInView) {
    return <span>{done ? display : '0'}</span>;
  }

  // While animating, show a simplified interpolated display
  if (target >= 1000000) {
    return <span>{(count * (target / 1000000)).toFixed(0)}M{suffix}</span>;
  }
  if (target >= 1000) {
    return <span>{(count * (target / 1000)).toFixed(0)}K{suffix}</span>;
  }
  return <span>{(count * target).toFixed(1)}{suffix}</span>;
};

const StatsBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="max-w-5xl mx-auto px-6 lg:px-8 -mt-8 relative z-20"
    >
      <div className="bg-white rounded-3xl shadow-soft-lg border border-border/50 p-8 lg:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border/50">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 lg:justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-text-primary tabular-nums">
                    <AnimatedCounter
                      target={stat.number}
                      suffix={stat.suffix}
                      display={stat.display}
                      isInView={isInView}
                    />
                  </p>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBar;
