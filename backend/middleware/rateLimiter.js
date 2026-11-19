const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes: 30 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter: 300 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };

