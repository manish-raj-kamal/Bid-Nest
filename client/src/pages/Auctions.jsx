import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuctionCard from '../components/ui/AuctionCard';
import BidModal from '../components/ui/BidModal';
import { useAuth } from '../context/auth';
import { apiRequest } from '../utils/api';

const now = Date.now();

const allAuctions = [
  {
    id: '65df3e000000000000000001',
    title: 'Swiss Chronograph Watch',
    image: '/auction_watch.png',
    currentBid: 500,
    bidCount: 0,
    endTime: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
    category: 'Jewelry',
    isLive: true,
  },
  {
    id: '65df3e000000000000000002',
    title: 'Limited Edition Sneakers',
    image: '/auction_sneakers.png',
    currentBid: 200,
    bidCount: 0,
    endTime: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
    category: 'Fashion',
    isLive: true,
  },
  {
    id: '65df3e000000000000000003',
    title: 'Vintage Film Camera',
    image: '/auction_camera.png',
    currentBid: 300,
    bidCount: 0,
    endTime: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
    category: 'Electronics',
    isLive: true,
  },
  {
    id: '65df3e000000000000000004',
    title: 'Designer Leather Handbag',
    image: '/auction_handbag.png',
    currentBid: 800,
    bidCount: 0,
    endTime: new Date(now + 8 * 60 * 60 * 1000).toISOString(),
    category: 'Fashion',
    isLive: true,
  },
  {
    id: '65df3e000000000000000005',
    title: 'Premium Headphones',
    image: '/hero_headphones.png',
    currentBid: 100,
    bidCount: 0,
    endTime: new Date(now + 4 * 60 * 60 * 1000).toISOString(),
    category: 'Electronics',
    isLive: true,
  },
];

const categories = ['All', 'Electronics', 'Fashion', 'Jewelry', 'Collectibles', 'Vehicles', 'Art', 'Real Estate'];

const Auctions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState(allAuctions);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidError, setBidError] = useState('');
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadAuctions = async () => {
      try {
        const data = await apiRequest('/api/auctions?status=live&limit=24');
        if (!ignore && data.auctions?.length) {
          setAuctions(data.auctions);
        }
      } catch {
        if (!ignore) {
          setAuctions(allAuctions);
        }
      }
    };

    loadAuctions();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = [...auctions]
    .filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'ending-soon') return new Date(a.endTime) - new Date(b.endTime);
      if (sortBy === 'highest-bid') return b.currentBid - a.currentBid;
      if (sortBy === 'most-bids') return b.bidCount - a.bidCount;
      return 0;
    });

  const updateAuctionBid = (auctionId, amount) => {
    setAuctions((items) =>
      items.map((auction) => {
        const id = auction._id || auction.id;
        if (id !== auctionId) return auction;

        return {
          ...auction,
          currentBid: amount,
          bidCount: Number(auction.bidCount || 0) + 1,
        };
      })
    );
  };

  const handleOpenBid = (auction) => {
    setBidError('');
    setSelectedAuction(auction);
  };

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

    const auctionId = selectedAuction._id || selectedAuction.id;
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

      updateAuctionBid(auctionId, amount);
      setSelectedAuction(null);
    } catch (error) {
      setBidError(error.message);
    } finally {
      setBidLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Browse Listings
            </p>
            <h1 className="text-3xl font-extrabold text-text-primary lg:text-4xl">
              Live Auctions
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-text-secondary">
            Find active lots, sort by bidding pressure, and place a bid without leaving the page.
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-lg border border-border bg-white p-4 shadow-soft sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search auctions..."
                className="min-h-12 w-full rounded-lg border border-border bg-bg-secondary py-3 pl-11 pr-4 text-sm text-text-primary transition-all placeholder:text-text-secondary/50 focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-3">
              <SlidersHorizontal className="h-4 w-4 text-text-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-12 flex-1 bg-transparent text-sm text-text-primary transition-all focus:ring-0 lg:w-44"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="highest-bid">Highest Bid</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`min-h-9 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-accent text-white shadow-soft'
                    : 'border border-border bg-white text-text-secondary hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-text-secondary mb-6">
          Showing <span className="font-semibold text-text-primary">{filtered.length}</span> auctions
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((auction, index) => (
              <AuctionCard
                key={auction._id || auction.id}
                auction={auction}
                index={index}
                onPlaceBid={handleOpenBid}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-border-light flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">No auctions found</h3>
            <p className="text-sm text-text-secondary">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
      <BidModal
        auction={selectedAuction}
        open={Boolean(selectedAuction)}
        loading={bidLoading}
        error={bidError}
        user={user}
        onClose={() => setSelectedAuction(null)}
        onLogin={() => navigate('/login')}
        onSubmit={handleSubmitBid}
      />
    </div>
  );
};

export default Auctions;
