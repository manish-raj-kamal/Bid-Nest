import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: [true, 'Auction reference is required'],
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bidder reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [1, 'Bid amount must be at least $1'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bidSchema.index({ auction: 1, createdAt: -1 });
bidSchema.index({ bidder: 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
