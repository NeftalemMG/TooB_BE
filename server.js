import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router as authRoutes } from './routes/authRoute.js';
import { router as productRoutes } from './routes/productRoute.js';
import { router as couponRoutes } from './routes/couponRoute.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoute.js';
import orderRoutes from './routes/orderRoute.js';
import { connectDB } from './lib/db.js';

const app = express();
const port = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://toob-ruddy.vercel.app',
  'https://toob-git-main-yoboinef-2000s-projects.vercel.app'
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TOOB API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
export default app;