import rateLimit from 'express-rate-limit';

const isDevelopment = process.env.NODE_ENV !== 'production';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // increased limit from 100 to 300 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 5,
  // In development, do not block during auth testing
  skip: () => isDevelopment,
  // Do not count successful requests towards the limit
  skipSuccessfulRequests: true,
  message: {
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for admin routes
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// More permissive limiter specifically for admin login route
export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 10,
  skip: () => isDevelopment,
  skipSuccessfulRequests: true,
  message: {
    message: 'Too many admin authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Special rate limiter for wishlist routes with higher limits
export const wishlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // higher limit for wishlist operations
  message: {
    message: 'Too many wishlist requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});