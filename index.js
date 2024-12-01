const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const healthRouter = require("./routes/health.route");
const dirRouter = require("./routes/dir.route");
const { logger, requestTimingLogger } = require('./logger/logger');

app.use(cors());
app.use(express.json());

app.use(logger);

app.get("/", (req,res)=>{

  const htmlFilePath = path.join(__dirname, 'index.html');

  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error('Error sending index file:', err);

      res.status(500).json({
        error: 'Failed to load health page',
      });
    }
  });
});

app.use('/cdn', express.static(path.join(__dirname, process.env.FILE_DIRECTORY)));

app.get('/cdn', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, process.env.FILE_DIRECTORY, req.params[0]));
});

app.use("/dir",dirRouter);
app.use("/health",healthRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found', path: req.originalUrl });
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});