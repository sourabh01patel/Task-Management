const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security and CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware with size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Apply general rate limiter to all API endpoints
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Management API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 and central error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(
      `[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app;


