import UpgradeRequest from '../models/UpgradeRequest.js';
import User from '../models/User.js';

// @desc    Create upgrade request (bidder → seller)
// @route   POST /api/upgrade-requests
export const createRequest = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'A message is required' });
    }

    // Check if user already has a pending request
    const existing = await UpgradeRequest.findOne({ user: req.user._id, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending upgrade request' });
    }

    const request = await UpgradeRequest.create({
      user: req.user._id,
      message: message.trim(),
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's latest upgrade request
// @route   GET /api/upgrade-requests/me
export const getMyRequest = async (req, res) => {
  try {
    const request = await UpgradeRequest.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(request || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all upgrade requests (admin)
// @route   GET /api/upgrade-requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await UpgradeRequest.find()
      .populate('user', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject an upgrade request (admin)
// @route   PUT /api/upgrade-requests/:id
export const handleRequest = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const request = await UpgradeRequest.findById(req.params.id).populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been handled' });
    }

    request.status = status;
    if (adminNote) request.adminNote = adminNote;
    await request.save();

    // If approved, upgrade the user to seller
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.user._id, { role: 'seller' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
