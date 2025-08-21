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

// Log CORS configuration on startup
console.log('=== CORS CONFIGURATION ===');
console.log('Environment CORS_ORIGINS:', process.env.CORS_ORIGINS || 'Not set');
console.log('Final allowed origins:', allowedCorsOrigins);
console.log('================================');

// Configure CORS with proper origin handling
console.log('Applying CORS middleware with origins:', allowedCorsOrigins);
try {
  app.use(cors({
    origin: allowedCorsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['Set-Cookie']
  }));
  console.log('CORS middleware applied successfully');
} catch (error) {
  console.error('Error applying CORS middleware:', error);
  // Fallback to basic CORS setup
  app.use(cors({
    origin: true,
    credentials: true
  }));
  console.log('Fallback CORS middleware applied');
}

// Note: CORS middleware automatically handles preflight requests
console.log('CORS middleware will handle preflight requests automatically');

// Global middleware to ensure CORS headers are set on all responses (as backup)
console.log('Setting up global CORS middleware as backup');
try {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Only set CORS headers if origin is present and allowed, and if they haven't been set already
    if (origin && allowedCorsOrigins.includes(origin) && !res.getHeader('Access-Control-Allow-Origin')) {
      console.log(`Global middleware: Setting CORS headers for origin: ${origin}`);
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    }
    
    next();
  });
  console.log('Global CORS middleware set up successfully');
} catch (error) {
  console.error('Error setting up global CORS middleware:', error);
  console.log('Skipping global CORS middleware setup');
}

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Request logging middleware with enhanced CORS debugging
console.log('Setting up request logging middleware');
try {
  app.use((req, res, next) => {
    try {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'} - User-Agent: ${req.headers['user-agent'] || 'No user-agent'}`);
      
      // Enhanced CORS debugging
      if (req.method === 'OPTIONS') {
        console.log('=== PREFLIGHT REQUEST DETECTED ===');
        console.log('Request headers:', JSON.stringify(req.headers, null, 2));
        console.log('Origin:', req.headers.origin);
        console.log('Access-Control-Request-Method:', req.headers['access-control-request-method']);
        console.log('Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
      }
      
      // Log CORS headers in response
      res.on('finish', () => {
        try {
          console.log(`=== RESPONSE SENT ===`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`CORS Headers:`);
          console.log(`  Access-Control-Allow-Origin: ${res.getHeader('Access-Control-Allow-Origin')}`);
          console.log(`  Access-Control-Allow-Credentials: ${res.getHeader('Access-Control-Allow-Credentials')}`);
          console.log(`  Access-Control-Allow-Methods: ${res.getHeader('Access-Control-Allow-Methods')}`);
          console.log(`  Access-Control-Allow-Headers: ${res.getHeader('Access-Control-Allow-Headers')}`);
        } catch (logError) {
          console.error('Error logging response headers:', logError);
        }
      });
    } catch (logError) {
      console.error('Error in request logging middleware:', logError);
    }
    
    next();
  });
  console.log('Request logging middleware set up successfully');
} catch (error) {
  console.error('Error setting up request logging middleware:', error);
  console.log('Skipping request logging middleware setup');
}

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
  
  // Set CORS headers manually for this test endpoint
  if (origin && allowedCorsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  }
  
  res.json({ 
    message: 'CORS test successful',
    origin: origin,
    allowedOrigins: allowedCorsOrigins,
    timestamp: new Date().toISOString()
  });
});

// Simple public endpoint for testing
app.get('/api/public-test', (req, res) => {
  const origin = req.headers.origin;
  console.log(`Public test request from origin: ${origin}`);
  
  // Set CORS headers manually for this test endpoint
  if (origin && allowedCorsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  }
  
  res.json({ 
    message: 'Public endpoint accessible',
    origin: origin,
    timestamp: new Date().toISOString()
  });
});

// Raw CORS test endpoint (no middleware interference)
app.get('/api/raw-cors-test', (req, res) => {
  const origin = req.headers.origin;
  console.log(`Raw CORS test request from origin: ${origin}`);
  
  // Always set CORS headers for this endpoint
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  
  res.json({ 
    message: 'Raw CORS test successful',
    origin: origin,
    headers: req.headers,
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
  
  // Handle path-to-regexp errors
  if (error.message && error.message.includes('Missing parameter name')) {
    console.error('Route parsing error detected:', error.message);
    return res.status(500).json({ 
      message: 'Route configuration error',
      error: 'Invalid route pattern detected'
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
  try {
    res.status(404).json({ 
      message: `Route ${req.originalUrl} not found` 
    });
  } catch (error) {
    console.error('Error in 404 handler:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

app.listen(port, () => {
    console.log("Hello From Server")
    console.log(`Server running on port ${port}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`)
    console.log(`Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}`)
    console.log('=== SERVER STARTUP COMPLETE ===')
    console.log('CORS configuration loaded successfully')
    console.log('All middleware configured and ready')
    console.log('================================')
    
    try {
        connectDb()
    } catch (error) {
        console.error('Error connecting to database:', error)
    }
})


