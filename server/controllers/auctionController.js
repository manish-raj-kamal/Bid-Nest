import Auction from '../models/Auction.js';

// @desc    Get all auctions
// @route   GET /api/auctions
export const getAuctions = async (req, res) => {
  try {
    const { category, status, featured, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;

    const total = await Auction.countDocuments(filter);
    const auctions = await Auction.find(filter)
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      auctions,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single auction
// @route   GET /api/auctions/:id
export const getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name avatar email')
      .populate('winner', 'name avatar');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create auction
// @route   POST /api/auctions
export const createAuction = async (req, res) => {
  try {
    const auction = await Auction.create({
      ...req.body,
      seller: req.user._id,
      currentBid: req.body.startingBid,
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured auctions
// @route   GET /api/auctions/featured
export const getFeaturedAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ featured: true, status: 'live' })
      .populate('seller', 'name avatar')
      .sort({ endTime: 1 })
      .limit(8);

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get categories with counts
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Auction.aggregate([
      { $match: { status: { $in: ['live', 'upcoming'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update auction images
// @route   PUT /api/auctions/:id/images
export const updateAuctionImages = async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one image' });
    }

    if (images.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 images allowed' });
    }

    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Verify user is the seller
    if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    auction.images = images;
    await auction.save();

    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's auctions
// @route   GET /api/auctions/me
export const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
