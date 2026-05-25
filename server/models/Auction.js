import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxLength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Vehicles', 'Real Estate', 'Art', 'Jewelry', 'Collectibles', 'Fashion'],
    },
    startingBid: {
      type: Number,
      required: [true, 'Starting bid is required'],
      min: [1, 'Starting bid must be at least $1'],
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    bidCount: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'ended', 'cancelled'],
      default: 'upcoming',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ category: 1 });
auctionSchema.index({ featured: 1 });

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;
