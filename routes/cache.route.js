const express = require('express');
const router = express.Router();
const redisClient = require("../config/redis.config")

const CACHE_EXPIRY = 60 * 5;

router.post('/', async (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'Key and value are required' });

    try {
        // Set data in Redis with an expiry (using NX to create a new entry only)
        await redisClient.set(key, JSON.stringify(value), {
            EX: CACHE_EXPIRY, // Expiration time in seconds
        });
        res.status(200).json({ message: 'Content cached', key });
    } catch (err) {
        console.error("Error setting cache:", err);
        res.status(500).json({ error: 'Failed to set cache' });
    }
});

router.get('/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const data = await redisClient.get(key);
        if (!data) {
            return res.status(404).json({ error: 'Cache miss' });
        }
        res.status(200).json({ message: 'Cache hit', data: JSON.parse(data) });
    } catch (err) {
        console.error("Error retrieving cache:", err);
        res.status(500).json({ error: 'Failed to get cache' });
    }
});

router.put('/:key', async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Value is required for update' });

    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: CACHE_EXPIRY, // Set expiration time in seconds
        });
        res.status(200).json({ message: 'Cache updated', key });
    } catch (err) {
        console.error("Error updating cache:", err);
        res.status(500).json({ error: 'Failed to update cache' });
    }
});


router.delete('/:key', async (req, res) => {
    const { key } = req.params;

    try {
        const response = await redisClient.del(key);
        if (response === 0) {
            return res.status(404).json({ error: 'Cache miss' });
        }
        res.status(200).json({ message: 'Cache entry deleted', key });
    } catch (err) {
        console.error("Error deleting cache:", err);
        res.status(500).json({ error: 'Failed to delete cache' });
    }
});

module.exports = router;