const redis = require('redis');

redisHost = '127.0.0.1';
redisPort = 6379

// Initialize Redis client with correct options
const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort
});

// Connect to Redis
redisClient.connect().catch(console.error); // Use connect() to return a Promise

redisClient.on('connect', () => {
    console.log("Connected to Redis");
});

redisClient.on('error', (err) => {
    console.error('Error occurred while connecting or accessing Redis server:', err);
});

module.exports = redisClient