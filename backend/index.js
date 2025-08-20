import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import multer from 'multer'
dotenv.config()
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import isAuth from './middleware/isAuth.js'

let port = process.env.PORT || 8000

let app = express()

app.use(cookieParser())
// Trust proxy so "secure" cookies work behind proxies (e.g., Render, Vercel)
app.set('trust proxy', 1)
// CORS origins - can be overridden by environment variable
const allowedCorsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'https://www.9tytwooffical.com',
      'https://9tytwooffical.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: No origin header, allowing request');
      return callback(null, true);
    }
    
    console.log(`CORS: Checking origin: ${origin}`);
    console.log(`CORS: Allowed origins: ${allowedCorsOrigins.join(', ')}`);
    
    if (allowedCorsOrigins.indexOf(origin) !== -1) {
      console.log(`CORS: Origin ${origin} is allowed`);
      callback(null, true);
    } else {
      console.log(`CORS: Origin ${origin} is blocked`);
      callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

// Handle preflight requests explicitly
app.options('*', cors())

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`Processing request from origin: ${origin}`);
  console.log(`Allowed origins: ${allowedCorsOrigins.join(', ')}`);
  
  if (origin && allowedCorsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`CORS origin allowed: ${origin}`);
  } else if (origin) {
    console.log(`CORS origin blocked: ${origin}`);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  next();
});

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'} - User-Agent: ${req.headers['user-agent'] || 'No user-agent'}`);
  
  // Log CORS-related headers for debugging
  if (req.method === 'OPTIONS') {
    console.log('Preflight request detected');
    console.log('Request headers:', req.headers);
  }
  
  next();
});

// Apply rate limiting to all routes
app.use(generalLimiter)

// Error handling middleware for multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File too large. Maximum file size is 10MB.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({ 
        message: 'Too many files. Maximum 10 files allowed.' 
      });
    }
    return res.status(400).json({ 
      message: 'File upload error: ' + error.message 
    });
  }
  next(error);
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const mongoose = await import('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Server health check failed',
      error: error.message 
    });
  }
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  const origin = req.headers.origin;
  console.log(`CORS test request from origin: ${origin}`);
  
  res.json({ 
    message: 'CORS test successful',
    origin: origin,
    allowedOrigins: allowedCorsOrigins,
    timestamp: new Date().toISOString()
  });
});

// Test authentication endpoint
app.get('/api/test-auth', isAuth, (req, res) => {
  try {
    res.json({ 
      message: 'Authentication successful',
      userId: req.userId,
      adminEmail: req.adminEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Authentication test failed',
      error: error.message 
    });
  }
});

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler caught:', error);
  
  // Handle CORS errors specifically
  if (error.message && error.message.includes('CORS')) {
    console.error('CORS error detected:', error.message);
    return res.status(403).json({ 
      message: 'CORS policy violation',
      error: error.message,
      allowedOrigins: allowedCorsOrigins
    });
  }
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      details: error.message 
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ 
      message: 'Invalid ID format' 
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expired' 
    });
  }
  
  // Default error response
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found` 
  });
});

app.listen(port,()=>{
    console.log("Hello From Server")
    console.log(`Server running on port ${port}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`)
    console.log(`Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}`)
    connectDb()
})


