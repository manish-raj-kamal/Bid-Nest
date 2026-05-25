# BidNest — Premium Auction Platform

A luxury minimal auction platform built with React, Tailwind CSS v4, Framer Motion, Node.js, Express.js, and MongoDB.

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Framer Motion** for premium animations
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`

### Backend

```bash
cd server
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/bidnest
# JWT_SECRET=your_secret_key

npm run dev
```

The API runs at `http://localhost:5000`

### Seed Database

```bash
cd server
npm run seed
```

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── assets/       # Images and icons
│   │   ├── App.jsx       # Main app
│   │   └── index.css     # Design system
│   └── vite.config.js
│
├── server/           # Express backend
│   ├── config/       # Database config
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth middleware
│   ├── seed.js       # Database seeder
│   └── server.js     # Entry point
│
└── README.md
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/me` | Get profile (auth) |
| GET | `/api/auctions` | List auctions |
| GET | `/api/auctions/featured` | Featured auctions |
| GET | `/api/auctions/:id` | Single auction |
| POST | `/api/auctions` | Create auction (auth) |
| GET | `/api/categories` | Categories with counts |
| POST | `/api/bids` | Place bid (auth) |
| GET | `/api/bids/:auctionId` | Auction bid history |

## License

MIT
