const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const cacheRouter = require('./routes/cache.route');
const downloadRouter = require("./routes/download.route");

app.use(express.json());

app.use('/cache',cacheRouter);
app.use("/download",downloadRouter);

const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
