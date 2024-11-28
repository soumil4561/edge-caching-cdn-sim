// cdn.js
const express = require("express");
const redisClient = require("./config/redis.config");

const app = express();
const PORT = 3002; // Port for the CDN server
const MAIN_SERVER_URL = "http://localhost:3000";

let cacheHits = 0;
let cacheMisses = 0;

app.get("/",(req,res)=>{
    res.send("Hello from server 2");
})

app.get("/download/:filename", async (req, res) => {
    const { filename } = req.params;
    const cacheKey = `file:${filename}`;
    // Start the timer for latency measurement
    const startTime = Date.now();
    try {
        // Check Redis for cached version
        const cachedFile = await redisClient.get(cacheKey);
        if (cachedFile) {
            cacheHits++;
            console.log(`Cache Hit: ${filename}`);  
            console.log("Serving cached file from CDN");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(Buffer.from(cachedFile, "binary"));
            const latency = Date.now() - startTime;
            console.log(`Cache Hit - Latency: ${latency}ms`);
            return;
        }

        // Cache miss
        cacheMisses++;
        console.log(`Cache Miss: ${filename}`);
        //no cache found. redirection to main server.
        // Cache miss, redirect to main server to fetch and cache the file there
        const latency = Date.now() - startTime;
        console.log(`Cache Miss - Latency: ${latency}ms`);
        const redirectURL = `${MAIN_SERVER_URL}/download/redirected/${filename}`
        console.log(`Cache miss, redirecting to main server on endpoint ${redirectURL}`);
        return res.redirect(redirectURL);
    } catch (error) {
        console.error("Error serving file from CDN:", error);
        res.status(500).json({ error: "Error serving file" });
    }
});

setInterval(() => {
    console.log(`Cache Hits: ${cacheHits}, Cache Misses: ${cacheMisses}`);
}, 60000); // Log every minute

app.listen(PORT, () => {
    console.log(`CDN server running on PORT ${PORT}`);
});
