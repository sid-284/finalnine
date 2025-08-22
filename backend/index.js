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

// =================== CORS CONFIG ===================
// Always put CORS FIRST
let allowedCorsOrigins;
try {
  if (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.trim()) {
    allowedCorsOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin);
    console.log('Using CORS_ORIGINS from environment:', process.env.CORS_ORIGINS);
  } else {
    allowedCorsOrigins = [
      'https://9tytwolinen.com',
      'https://www.9tytwolinen.com',
      'https://www.9tytwooffical.com',
      'https://9tytwooffical.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    console.log('Using default CORS origins');
  }
} catch (error) {
  console.error('Error parsing CORS_ORIGINS:', error);
  allowedCorsOrigins = [
    'https://9tytwolinen.com',
    'https://www.9tytwolinen.com',
    'https://www.9tytwooffical.com',
    'https://9tytwooffical.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  console.log('Falling back to default CORS origins');
}

console.log('=== CORS CONFIGURATION ===');
console.log('Environment CORS_ORIGINS:', process.env.CORS_ORIGINS || 'Not set');
console.log('Final allowed origins:', allowedCorsOrigins);
console.log('================================');

// Apply CORS FIRST
app.use(cors({
  origin: allowedCorsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Explicitly allow preflight requests
app.options('*', cors({
  origin: allowedCorsOrigins,
  credentials: true
}));

// =================== OTHER MIDDLEWARE ===================
app.use(cookieParser())
app.set('trust proxy', 1) // Trust proxy so "secure" cookies work

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// =================== LOGGING ===================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// =================== RATE LIMITER ===================
app.use(generalLimiter)

// =================== MULTER ERROR HANDLER ===================
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File too large. Maximum file size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({ message: 'Too many files. Maximum 10 files allowed.' });
    }
    return res.status(400).json({ message: 'File upload error: ' + error.message });
  }
  next(error);
});

// =================== ROUTES ===================
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'OK', database: dbStatus, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Server health check failed', error: error.message });
  }
});

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// =================== ERROR HANDLER ===================
app.use((error, req, res, next) => {
  console.error('Global error handler caught:', error);

  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS policy violation', error: error.message, allowedOrigins: allowedCorsOrigins });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation Error', details: error.message });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong' });
});

// =================== 404 HANDLER ===================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// =================== SERVER START ===================
app.listen(port, () => {
  console.log("Hello From Server")
  console.log(`Server running on port ${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`)
  console.log(`Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}`)
  console.log('=== SERVER STARTUP COMPLETE ===')
  try {
    connectDb()
  } catch (error) {
    console.error('Error connecting to database:', error)
  }
})
