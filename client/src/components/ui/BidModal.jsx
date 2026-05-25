import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gavel, LogIn, X } from 'lucide-react';
import Button from './Button';

const increments = [25, 50, 100];

const getMinimumBid = (auction) => Number(auction?.currentBid || 0) + 1;

const BidModal = ({ auction, open, loading = false, error = '', user, onClose, onSubmit, onLogin }) => {
  const [draftBid, setDraftBid] = useState({ auctionKey: null, value: '' });
  const minimumBid = getMinimumBid(auction);

  if (!auction) return null;

  const auctionKey = auction._id || auction.id || auction.title;
  const fallbackAmount = String(Math.ceil(Number(auction.currentBid || 0) + 25));
  const amount = draftBid.auctionKey === auctionKey ? draftBid.value : fallbackAmount;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(Number(amount || fallbackAmount));
  };

  const setAmount = (value) => {
    setDraftBid({ auctionKey, value });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/45 px-4 py-5 backdrop-blur-sm sm:items-center"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-md rounded-lg border border-border bg-white shadow-soft-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-light px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Place Bid</p>
                <h2 className="mt-1 text-xl font-bold text-text-primary">{auction.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-border-light hover:text-text-primary"
                aria-label="Close bid dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!user ? (
              <div className="px-5 py-6">
                <div className="mb-5 flex items-center gap-4 rounded-lg border border-border bg-bg-secondary p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Sign in to bid</h3>
                    <p className="mt-1 text-sm text-text-secondary">Your account keeps bids secure and linked to your profile.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" className="flex-1" onClick={onLogin} icon={<ArrowRight className="h-4 w-4" />}>
                    Sign In
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={onClose}>
                    Keep Browsing
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-6">
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-bg-secondary p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Current Bid</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">${Number(auction.currentBid || 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Total Bids</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{auction.bidCount || 0}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                  Your Bid
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-secondary">$</span>
                  <input
                    type="number"
                    min={minimumBid}
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="w-full rounded-lg border border-border bg-bg-secondary py-3.5 pl-8 pr-4 text-lg font-bold text-text-primary transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-text-secondary">Minimum bid is ${minimumBid.toLocaleString()}.</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {increments.map((increment) => (
                    <button
                      key={increment}
                      type="button"
                      onClick={() => setAmount(String(Number(auction.currentBid || 0) + increment))}
                      className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-accent/40 hover:bg-accent-light"
                    >
                      +${increment}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={loading} icon={<Gavel className="h-4 w-4" />}>
                    {loading ? 'Placing Bid...' : 'Place Bid'}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BidModal;
