// logger.js
const morgan = require('morgan');
const performanceNow = require('performance-now'); // Optional, for more accurate timing

// Create a Morgan logging middleware
const logger = morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms');

// Custom middleware for logging the time to process each request
const requestTimingLogger = (req, res, next) => {
  const start = performanceNow(); // Record start time for precise timing
  
  res.on('finish', () => {
    const duration = (performanceNow() - start).toFixed(3); // Get the time taken to process the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next(); // Pass to the next middleware/route handler
};

module.exports = { logger, requestTimingLogger };
