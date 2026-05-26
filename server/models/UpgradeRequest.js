import mongoose from 'mongoose';

const upgradeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'A message is required'],
      maxLength: [500, 'Message cannot exceed 500 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const UpgradeRequest = mongoose.model('UpgradeRequest', upgradeRequestSchema);

export default UpgradeRequest;
