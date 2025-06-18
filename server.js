import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import logger from './src/utils/logger.js';
import config from './src/config/config.js';
import itemRoutes from './src/routes/itemRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

// Helmet and CORS
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Rate Limiter
app.use('/api/', rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    logger[status >= 400 ? 'warn' : 'info']('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  next();
});

// Health Check
app.get('/health', async (req, res) => {
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

// API Docs
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      title: 'Scalable REST API',
      version: '1.0.0',
      endpoints: {
        'GET /api/v1/items': 'Get all items',
        'POST /api/v1/items': 'Create item',
        'GET /api/v1/items/:id': 'Get item by ID',
        'PUT /api/v1/items/:id': 'Update item by ID',
        'DELETE /api/v1/items/:id': 'Delete item by ID',
        'GET /health': 'Health check'
      }
    }
  });
});

// Register Routes
app.use('/api/v1/items', itemRoutes);

// Handle 404 and Errors
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = config.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`API Documentation: http://localhost:${PORT}/api`);
  logger.info(`Health Check:      http://localhost:${PORT}/health`);
});

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => {
    logger.error('Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', err => {
  logger.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;
