import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Gavel, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/auth';
import { apiRequest } from '../utils/api';
import CountdownTimer from '../components/ui/CountdownTimer';
import BidModal from '../components/ui/BidModal';
import EditImagesModal from '../components/ui/EditImagesModal';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isEditImagesOpen, setIsEditImagesOpen] = useState(false);
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const auctionData = await apiRequest(`/api/auctions/${id}`);
      setAuction(auctionData);

      const bidsData = await apiRequest(`/api/bids/${id}`);
      setBids(bidsData);
    } catch (err) {
      setError(err.message || 'Failed to load auction details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  const handleSubmitBid = async (amount) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!Number.isFinite(amount) || amount <= Number(auction.currentBid || 0)) {
      setBidError(`Bid must be higher than $${Number(auction.currentBid || 0).toLocaleString()}.`);
      return;
    }

    setBidLoading(true);
    setBidError('');

    try {
      const newBid = await apiRequest('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ auctionId: auction._id, amount }),
      });

      // Update local state smoothly
      setBids((prev) => [newBid, ...prev]);
      setAuction((prev) => ({
        ...prev,
        currentBid: amount,
        bidCount: prev.bidCount + 1,
      }));
      
      setIsBidModalOpen(false);
    } catch (err) {
      setBidError(err.message || 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary text-sm uppercase tracking-widest font-semibold">Loading Auction...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Auction Not Found</h2>
        <p className="text-text-secondary mb-6">{error || "The auction you're looking for doesn't exist or has been removed."}</p>
        <Link to="/auctions" className="px-6 py-3 bg-accent text-white rounded-lg font-semibold shadow-soft hover:bg-accent-dark transition-colors">
          Back to Auctions
        </Link>
      </div>
    );
  }

  const coverImage = auction.image || auction.images?.[0] || '/placeholder-auction.png';
  const isLive = auction.status === 'live';
  const hasBids = auction.bidCount > 0;
  const isSeller = user && auction.seller?._id === user._id;

  const handleImagesUpdate = (newImages) => {
    setAuction((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/auctions" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to all auctions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            
            {/* Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square md:aspect-video bg-white rounded-2xl overflow-hidden border border-border shadow-soft"
            >
              <img src={coverImage} alt={auction.title} className="w-full h-full object-cover" />
              
              {isLive && (
                <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-soft-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Live Auction</span>
                </div>
              )}
              
              {isSeller && (
                <button
                  onClick={() => setIsEditImagesOpen(true)}
                  className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-4 py-2 shadow-soft-lg text-sm font-bold text-text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  Edit Images
                </button>
              )}
            </motion.div>

            {/* Description Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-border shadow-soft p-6 sm:p-8"
            >
              <h2 className="text-xl font-bold text-text-primary mb-4">Description</h2>
              <div className="prose prose-sm sm:prose-base prose-slate max-w-none text-text-secondary whitespace-pre-wrap">
                {auction.description}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {auction.seller?.avatar ? (
                    <img src={auction.seller.avatar} alt={auction.seller.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-text-secondary" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Listed By</p>
                  <p className="text-sm font-medium text-text-primary">{auction.seller?.name || 'Unknown User'}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bidding Dashboard */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-28 bg-white rounded-2xl border border-border shadow-soft-lg overflow-hidden flex flex-col"
            >
              {/* Pricing Header */}
              <div className="p-6 sm:p-8 border-b border-border bg-bg-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded">
                    {auction.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-text-secondary text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <CountdownTimer targetTime={auction.endTime} size="sm" />
                  </div>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mt-4 mb-6 leading-tight">
                  {auction.title}
                </h1>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">
                      {hasBids ? 'Current Bid' : 'Base Price'}
                    </p>
                    <p className="text-4xl font-extrabold text-text-primary tracking-tight">
                      ${Number(auction.currentBid || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Bids</p>
                    <p className="text-lg font-bold text-text-primary">{auction.bidCount}</p>
                  </div>
                </div>

                {isLive ? (
                  <button
                    onClick={() => setIsBidModalOpen(true)}
                    className="w-full mt-6 bg-accent hover:bg-accent-dark text-white font-bold py-4 px-6 rounded-xl shadow-soft transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-5 h-5" />
                    Place a Bid
                  </button>
                ) : (
                  <div className="w-full mt-6 bg-bg-secondary text-text-secondary font-bold py-4 px-6 rounded-xl text-center border border-border">
                    Auction Ended
                  </div>
                )}
              </div>

              {/* Bid History List */}
              <div className="flex-1 flex flex-col max-h-[400px]">
                <div className="p-4 bg-bg-secondary border-b border-border">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Bid History</h3>
                </div>
                
                <div className="overflow-y-auto flex-1 p-4">
                  {bids.length > 0 ? (
                    <div className="space-y-4">
                      {bids.map((bid, i) => (
                        <div key={bid._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-primary transition-colors border border-transparent hover:border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center overflow-hidden">
                              {bid.bidder?.avatar ? (
                                <img src={bid.bidder.avatar} alt={bid.bidder.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                {bid.bidder?.name || 'Anonymous'}
                                {i === 0 && <span className="text-[9px] uppercase tracking-wider bg-accent/10 text-accent px-1.5 py-0.5 rounded">Highest</span>}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {new Date(bid.createdAt).toLocaleString(undefined, {
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <p className="text-base font-bold text-text-primary">
                            ${Number(bid.amount).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
                      <Gavel className="w-8 h-8 text-text-secondary mb-3 opacity-50" />
                      <p className="text-sm font-medium text-text-primary">No bids yet</p>
                      <p className="text-xs text-text-secondary mt-1">Be the first to bid on this item!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BidModal
        auction={auction}
        open={isBidModalOpen}
        loading={bidLoading}
        error={bidError}
        user={user}
        onClose={() => setIsBidModalOpen(false)}
        onLogin={() => navigate('/login')}
        onSubmit={handleSubmitBid}
      />

      <EditImagesModal
        auction={auction}
        open={isEditImagesOpen}
        onClose={() => setIsEditImagesOpen(false)}
        user={user}
        onUpdate={handleImagesUpdate}
      />
    </div>
  );
};

export default AuctionDetails;
