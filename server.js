require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./src/utils/logger');
const config = require('./src/config/config');
const itemRoutes = require('./src/routes/itemRoutes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      version: '1.0.0',
      uptime: process.uptime()
    },
    message: 'Server is healthy'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      title: 'Scalable REST API',
      version: '1.0.0',
      endpoints: {
        'POST /api/v1/items': 'Create a new item',
        'GET /api/v1/items': 'Get all items (with pagination and filtering)',
        'GET /api/v1/items/:id': 'Get item by ID',
        'PUT /api/v1/items/:id': 'Update item by ID',
        'DELETE /api/v1/items/:id': 'Delete item by ID',
        'GET /api/v1/items/stats': 'Get items statistics',
        'GET /health': 'Health check endpoint'
      }
    },
    message: 'API Documentation'
  });
});

// API routes
app.use('/api/v1/items', itemRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.NODE_ENV} mode`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = app;
