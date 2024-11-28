const express = require('express');
const router = express.Router();
const downloadController = require("../controllers/download.controller"); 

router.get("/:filename", downloadController.sendFile);

router.get("/cached/:filename", downloadController.sendFileWithCache);

// router.get("/redirected/:filename", downloadController.sendFile);

module.exports = router;
