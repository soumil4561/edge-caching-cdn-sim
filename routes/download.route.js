const express = require('express');
const router = express.Router();
const downloadController = require("../controllers/download.controller"); 

// router.get("/:filename", downloadController.sendFile);
router.get("/:filename", (req, res) => {
    const { filename } = req.params;
    const edgeBaseUrl = downloadController.getEdgeServer();
    console.log(edgeBaseUrl);
    const cdnUrl = `${edgeBaseUrl}/download/${filename}`;
    res.redirect(cdnUrl); // Redirect to CDN
});

router.get("/redirected/:filename", downloadController.sendFile);

module.exports = router;
