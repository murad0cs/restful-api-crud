import logger from '../utils/logger.js';
import config from '../config/config.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger[statusCode >= 500 ? 'error' : 'warn']('Handled Error', {
    message,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    stack: err.stack,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
