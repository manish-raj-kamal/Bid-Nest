import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime, size = 'md' }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const pad = (n) => String(n).padStart(2, '0');

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1 font-semibold text-text-primary ${sizeClasses[size]}`}>
      <span className="tabular-nums">{pad(timeLeft.hours)}h</span>
      <span className="text-text-secondary">:</span>
      <span className="tabular-nums">{pad(timeLeft.minutes)}m</span>
      <span className="text-text-secondary">:</span>
      <span className="tabular-nums">{pad(timeLeft.seconds)}s</span>
    </div>
  );
};

export default CountdownTimer;
