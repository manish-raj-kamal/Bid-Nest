import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Auction from './models/Auction.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Auction.deleteMany();

    // Create demo users
    const users = await User.create([
      {
        name: 'John Seller',
        email: 'john@bidnest.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=John',
      },
      {
        name: 'Sarah Bidder',
        email: 'sarah@bidnest.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
      },
      {
        name: 'Mike Collector',
        email: 'mike@bidnest.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mike',
      },
    ]);

    const now = new Date();

    // Create demo auctions
    const auctions = await Auction.create([
      {
        title: 'Swiss Chronograph Watch',
        description: 'A stunning Swiss-made chronograph with sapphire crystal and automatic movement.',
        images: ['/auction_watch.png'],
        category: 'Jewelry',
        startingBid: 500,
        currentBid: 1250,
        bidCount: 34,
        startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
        seller: users[0]._id,
        status: 'live',
        featured: true,
      },
      {
        title: 'Limited Edition Sneakers',
        description: 'Rare limited edition sneakers in pristine condition, never worn.',
        images: ['/auction_sneakers.png'],
        category: 'Fashion',
        startingBid: 200,
        currentBid: 480,
        bidCount: 22,
        startTime: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000),
        seller: users[1]._id,
        status: 'live',
        featured: true,
      },
      {
        title: 'Vintage Film Camera',
        description: 'Classic vintage film camera in excellent working condition.',
        images: ['/auction_camera.png'],
        category: 'Electronics',
        startingBid: 300,
        currentBid: 890,
        bidCount: 18,
        startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        seller: users[2]._id,
        status: 'live',
        featured: true,
      },
      {
        title: 'Designer Leather Handbag',
        description: 'Authentic designer leather handbag, crafted with premium Italian leather.',
        images: ['/auction_handbag.png'],
        category: 'Fashion',
        startingBid: 800,
        currentBid: 1680,
        bidCount: 41,
        startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 8 * 60 * 60 * 1000),
        seller: users[0]._id,
        status: 'live',
        featured: true,
      },
      {
        title: 'Premium Headphones',
        description: 'Studio-quality wireless headphones with active noise cancellation.',
        images: ['/hero_headphones.png'],
        category: 'Electronics',
        startingBid: 100,
        currentBid: 230,
        bidCount: 15,
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        seller: users[1]._id,
        status: 'live',
        featured: true,
      },
    ]);

    console.log(`✅ Seeded ${users.length} users`);
    console.log(`✅ Seeded ${auctions.length} auctions`);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
