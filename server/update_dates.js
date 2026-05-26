import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Auction from './models/Auction.js';

dotenv.config();

const updateDates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const auctions = await Auction.find({});
    console.log(`Found ${auctions.length} auctions to update.`);
    
    for (let auction of auctions) {
      const days = Math.random() * (5 - 3) + 3;
      auction.endTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      await auction.save();
    }
    
    console.log('Successfully updated all auction end times!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateDates();
