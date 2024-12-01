const morgan = require('morgan');
const performanceNow = require('performance-now');

const logger = morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms');

const requestTimingLogger = (req, res, next) => {
  const start = performanceNow();
  
  res.on('finish', () => {
    const duration = (performanceNow() - start).toFixed(3);
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};

module.exports = { logger, requestTimingLogger };
