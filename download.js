const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Directory where files are stored
const FILE_DIRECTORY = path.join(__dirname, 'files');

// Route to handle file download
app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(FILE_DIRECTORY, filename);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist:", filePath);
            return res.status(404).json({ error: 'File not found' });
        }

        // Send the file as an attachment to initiate download
        res.download(filePath, filename, (downloadErr) => {
            if (downloadErr) {
                console.error("Error downloading file:", downloadErr);
                res.status(500).json({ error: 'Error downloading file' });
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`File download server running on http://localhost:${PORT}`);
});
