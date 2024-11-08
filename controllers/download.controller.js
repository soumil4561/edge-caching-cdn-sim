// controllers/download.controller.js
const path = require("path");
const fs = require("fs");
const downloadService = require("../services/download.service");
const redisClient = require("../config/redis.config");

const edgeServers = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

const FILE_DIRECTORY = path.join(__dirname, "..", "files");

const sendFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(FILE_DIRECTORY, filename);
  const cacheKey = `file:${filename}`;

  // Check if the file exists
  const result = await downloadService.sendFilefromPath(filePath);
  if (result.success) {
    const readStream = fs.createReadStream(result.filePath);

    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ error: "Error streaming file" });
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    readStream.pipe(res);

    readStream.on("end", () => {
        setImmediate(async () => {
            try {
                const fileData = await fs.promises.readFile(result.filePath);
                await redisClient.set(cacheKey, fileData, { EX: 60 * 5 }); // Cache for 5 minutes
                console.log("File cached successfully");
            } catch (err) {
                console.error("Error caching file:", err);
            }
        });
    });
  } else {
    res.status(404).json({ error: result.error });
  }
};

const getEdgeServer = () => {
  return edgeServers[Math.floor(Math.random() * edgeServers.length)];
};

module.exports = {
  sendFile,
  getEdgeServer,
};
