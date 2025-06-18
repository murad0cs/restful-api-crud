const logger = require('../utils/logger');
const { AppError } = require('../utils/AppError');
const config = require('../config/config');

const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with context
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Mongoose bad ObjectId (for future database integration)
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = new AppError(message, 400);
  }

  // Mongoose duplicate key (for future database integration)
  if (err.code === 11000)
  {}
}

module.exports = {
  notFound,
  errorHandler
};
