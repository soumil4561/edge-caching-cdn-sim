const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/list', (req, res) => {
    const publicDir = path.join(__dirname, '..', process.env.FILE_DIRECTORY);

  fs.readdir(publicDir, (err, files) => {
    if (err) {
      console.error('Error reading public directory:', err);
      return res.status(500).json({ error: 'Failed to read public directory' });
    }

    const fileList = files.map((file) => {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        size: stats.isFile() ? `${(stats.size / 1024).toFixed(2)} KB` : 'N/A', // File size in KB, 'N/A' if not a file
        // isDirectory: stats.isDirectory(),
      };
    });

    res.json(fileList);
  });
});

module.exports = router;