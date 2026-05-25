import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Button from './ui/Button';
import LiveBadge from './ui/LiveBadge';
import CountdownTimer from './ui/CountdownTimer';
import heroImage from '../assets/hero_headphones.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const bidderAvatars = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Oscar',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Mia',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Max',
];

const heroHighlights = [
  { icon: ShieldCheck, label: 'Verified sellers' },
  { icon: Sparkles, label: 'Premium lots daily' },
  { icon: Users, label: 'Live bidding rooms' },
];

// Default end time 4 hours from now
const auctionEndTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pb-14 pt-24 sm:pb-16 lg:pt-28">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-[6%] h-56 w-56 rounded-full bg-[#f4d8a2]/50 blur-3xl" />
        <div className="absolute top-[12%] right-[10%] h-[26rem] w-[26rem] rounded-full bg-accent/[0.13] blur-[110px]" />
        <div className="absolute bottom-[14%] left-[42%] h-44 w-44 rounded-full bg-[#fff4dc] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[72vh] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">

          {/* LEFT COLUMN — Editorial Content */}
          <div className="lg:col-span-5 flex flex-col gap-7">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
              <LiveBadge text="LIVE NOW" count="2,456 Auctions" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="max-w-xl text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-[5rem]"
            >
              Compete.
              <br />
              Bid.{' '}
              <span
                className="font-brush text-accent inline-block"
                style={{ transform: 'rotate(-3deg)', fontSize: '1.08em' }}
              >
                Conquer.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-lg"
            >
              Join a gallery-like marketplace for rare finds, fast bids, and polished seller experiences that feel more premium than chaotic.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-3"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/auctions')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Auctions
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/create-auction')}>
                Create Auction
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl"
            >
              {heroHighlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-3 rounded-lg border border-white/70 px-4 py-3 shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-accent">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CENTER COLUMN — Floating Product */}
          <div className="lg:col-span-4 flex items-center justify-center relative">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[78%] h-[48px] bg-ink/10 rounded-[50%] blur-2xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mesh-panel relative rounded-lg border border-white/70 bg-white/70 p-5 shadow-soft-xl"
            >
              <div className="absolute inset-x-6 top-5 h-10 rounded-full bg-white/80 blur-xl" />
              <motion.img
                src={heroImage}
                alt="Premium Headphones"
                className="w-full max-w-sm lg:max-w-md object-contain relative z-10 drop-shadow-[0_35px_35px_rgba(17,24,39,0.18)]"
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Live Auction Card */}
          <div className="lg:col-span-3 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass-strong w-full max-w-[305px] rounded-lg border border-white/80 p-6 shadow-soft-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-text-secondary mb-1">Featured Lot</p>
                  <h3 className="font-semibold text-base text-text-primary">Premium Headphones</h3>
                </div>
                <span className="rounded-full bg-accent-light px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Hot
                </span>
              </div>

              <div className="mb-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">Current Bid</p>
              </div>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-extrabold text-text-primary">$230</span>
                <span className="text-sm font-bold text-accent">15 Bids</span>
              </div>

              <div className="mb-4 rounded-lg border border-white/70 bg-white/70 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <CountdownTimer targetTime={auctionEndTime} size="md" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-xs font-medium text-accent">Ending soon</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex -space-x-2">
                  {bidderAvatars.map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt="Bidder"
                      className="w-8 h-8 rounded-full border-2 border-white bg-bg-primary"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-accent bg-accent-light rounded-full px-2.5 py-1">
                  +13
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
