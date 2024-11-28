const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the 'public' directory
app.use('/download', express.static(path.join(__dirname, 'public')));

// You can add custom headers if needed, like Cache-Control
app.get('/download/*', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');  // Cache for 1 hour
    res.sendFile(path.join(__dirname, 'public', req.params[0]));
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
