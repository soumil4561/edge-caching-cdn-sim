const express = require('express');
const os = require('os');
const path = require('path');
const router = express.Router();

// Mocked cache statistics
const cacheStats = {
  hits: 0,
  misses: 0,
  size: '0 MB',
  items: 0,
};

// Mocked request statistics
const requestStats = {
  total: 0,
  methods: {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0,
    OTHER: 0,
  },
  special: {
    healthJson: 0,
  },
};

// Middleware to track requests, excluding /health/json
router.use((req, res, next) => {
  if (req.path === '/health/json') {
    requestStats.special.healthJson += 1;
  } else {
    requestStats.total += 1;
    requestStats.methods[req.method] = (requestStats.methods[req.method] || 0) + 1;
  }
  next();
});

// Serve the health HTML page
router.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'health.html');

  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error('Error sending health HTML file:', err);

      res.status(500).json({
        error: 'Failed to load health page',
      });
    }
  });
});

// Return health stats as JSON
router.get('/json', (req, res) => {
  const healthStats = {
    uptime: process.uptime(),
    memoryUsage: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(process.memoryUsage().external / 1024 / 1024).toFixed(2)} MB`,
    },
    cpuUsage: {
      user: `${(process.cpuUsage().user / 1000000).toFixed(2)} ms`,
      system: `${(process.cpuUsage().system / 1000000).toFixed(2)} ms`,
    },
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    loadAverage: os.loadavg(),
    requestStats,
  };

  res.json(healthStats);
});

// Return cache stats
router.get('/cache', (req, res) => {
  res.json({
    cache: {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      size: cacheStats.size,
      items: cacheStats.items,
      hitRate: requestStats.total
        ? ((cacheStats.hits / requestStats.total) * 100).toFixed(2) + '%'
        : 'N/A',
    },
  });
});

// Return request stats
router.get('/requests', (req, res) => {
  res.json({
    requests: requestStats,
  });
});

module.exports = router;
