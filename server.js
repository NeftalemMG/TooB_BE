// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import { router as authRoutes } from './routes/authRoute.js';
// import { router as productRoutes } from './routes/productRoute.js';
// // import { router as cartRoutes } from './routes/cartRoutes.js';
// import { router as couponRoutes } from './routes/couponRoute.js';
// // import { router as paymentRoutes } from './routes/paymentRoute.js';
// import cartRoutes from './routes/cartRoutes.js';
// import paymentRoutes from './routes/paymentRoute.js';
// import orderRoutes from './routes/orderRoute.js';

// import { connectDB } from './lib/db.js';

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));

// app.use(express.json({ limit: "10mb"}));
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/coupon', couponRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/orders', orderRoutes);

// app.listen(port, () => {
//     console.log(`Server listening on port http://localhost:${port}`);
//     connectDB();
// });



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

// Configure allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://your-frontend-domain.vercel.app', // Add your Vercel frontend domain here once deployed
];

// Enhanced CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: "10mb"}));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    connectDB();
});

export default app; 