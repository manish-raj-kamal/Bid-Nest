import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import AuctionCard from './ui/AuctionCard';
import BidModal from './ui/BidModal';
import { useAuth } from '../context/auth';
import { apiRequest } from '../utils/api';

const FeaturedAuctions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchFeatured = async () => {
      try {
        const data = await apiRequest('/api/auctions/featured');
        if (!ignore && data) {
          setItems(data);
        }
      } catch (err) {
        console.error("Failed to load featured auctions:", err);
      }
    };
    fetchFeatured();
    return () => { ignore = true; };
  }, []);

  const handleSubmitBid = async (amount) => {
    if (!selectedAuction) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!Number.isFinite(amount) || amount <= Number(selectedAuction.currentBid || 0)) {
      setBidError(`Bid must be higher than $${Number(selectedAuction.currentBid || 0).toLocaleString()}.`);
      return;
    }

    setBidLoading(true);
    setBidError('');

    try {
      if (selectedAuction._id) {
        await apiRequest('/api/bids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ auctionId: selectedAuction._id, amount }),
        });
      }

      setItems((current) =>
        current.map((auction) =>
          (auction._id || auction.id) === (selectedAuction._id || selectedAuction.id)
            ? { ...auction, currentBid: amount, bidCount: Number(auction.bidCount || 0) + 1 }
            : auction
        )
      );
      setSelectedAuction(null);
    } catch (error) {
      setBidError(error.message);
    } finally {
      setBidLoading(false);
    }
  };

  const openBid = (auction) => {
    setBidError('');
    setSelectedAuction(auction);
  };

  return (
    <section id="auctions" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Featured Listings
            </p>
            <h2 className="text-3xl font-extrabold text-text-primary lg:text-4xl">
              Featured Auctions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/auctions"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((auction, index) => (
            <AuctionCard key={auction._id || auction.id} auction={auction} index={index} onPlaceBid={openBid} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            View all auctions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <BidModal
        auction={selectedAuction}
        open={Boolean(selectedAuction)}
        error={bidError}
        loading={bidLoading}
        user={user}
        onClose={() => setSelectedAuction(null)}
        onLogin={() => navigate('/login')}
        onSubmit={handleSubmitBid}
      />
    </section>
  );
};

export default FeaturedAuctions;
