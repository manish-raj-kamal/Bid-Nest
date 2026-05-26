import Bid from '../models/Bid.js';
import Auction from '../models/Auction.js';

// @desc    Place a bid
// @route   POST /api/bids
export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.status !== 'live') {
      return res.status(400).json({ message: 'Auction is not currently live' });
    }

    if (new Date() > new Date(auction.endTime)) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({
        message: `Bid must be higher than current bid of $${auction.currentBid}`,
      });
    }

    if (auction.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount,
    });

    // Update auction with new bid
    auction.currentBid = amount;
    auction.bidCount += 1;
    await auction.save();

    const populatedBid = await Bid.findById(bid._id).populate('bidder', 'name avatar');

    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bids for an auction
// @route   GET /api/bids/:auctionId
export const getAuctionBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate('bidder', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bids
// @route   GET /api/bids/me
export const getUserBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate('auction', 'title images currentBid status endTime')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
