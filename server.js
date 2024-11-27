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

// Define allowed origins with regex for Vercel preview deployments
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://toob-ruddy.vercel.app',
//   /^https:\/\/toob-.*-yoboinef-2000s-projects\.vercel\.app$/,
//   /^https:\/\/toob-.*\.vercel\.app$/
// ];

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://toob-ruddy.vercel.app',
      /^https:\/\/toob-.*\.vercel\.app$/
    ];

    if (!origin || allowedOrigins.some(allowed => 
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS configuration
app.use(cors(corsOptions));

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Add request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TOOB API is running',
    environment: process.env.NODE_ENV
  });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Enhance your error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
      console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;