import { motion } from 'framer-motion';
import { ArrowRight, Clock, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const AuctionCard = ({ auction, index = 0, onPlaceBid }) => {
  const {
    title,
    image,
    images,
    currentBid,
    bidCount,
    endTime,
    category,
    isLive = true,
  } = auction;
  const coverImage = image || images?.[0] || '/placeholder-auction.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-lg border border-border bg-white shadow-soft transition-all duration-300 hover:border-accent/25 hover:shadow-soft-lg"
    >
      {/* Clickable Area */}
      <Link to={`/auctions/${auction._id || auction.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-primary">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Live Badge */}
          {isLive && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 shadow-soft backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Live</span>
            </div>
          )}
          {/* Category Tag */}
          {category && (
            <div className="absolute right-4 top-4 rounded-full bg-white/92 px-3 py-1.5 shadow-soft backdrop-blur-sm">
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">{category}</span>
            </div>
          )}
        </div>

        {/* Content Top */}
        <div className="p-5 sm:p-6 pb-0">
          <h3 className="mb-4 min-h-6 truncate text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent">
            {title}
          </h3>
        </div>
      </Link>

      <div className="p-5 sm:p-6 pt-0">
        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-text-secondary">
              {!bidCount || bidCount === 0 ? 'Base Price' : 'Current Bid'}
            </p>
            <p className="text-2xl font-bold text-text-primary">${Number(currentBid || 0).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="mb-1 flex items-center justify-end gap-1 text-text-secondary">
              <Clock className="w-3 h-3" />
              <span className="text-[11px] uppercase tracking-[0.16em]">Ends in</span>
            </div>
            <CountdownTimer targetTime={endTime} size="sm" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border-light pt-4">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Gavel className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{bidCount} bids</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onPlaceBid?.(auction)}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white shadow-soft transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            Place Bid
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
