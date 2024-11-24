import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';
import User from '../models/userModel.js';  


export const authenticate = async (req, res, next) => {
  try {
      // Get token from cookie or authorization header
      const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ message: 'Authentication required' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
          return res.status(401).json({ message: 'User not found' });
      }

      // Attach user to request object
      req.user = user;
      next();
  } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// };

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};


export const protectRoute = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};