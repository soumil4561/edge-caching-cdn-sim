const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const cacheRouter = require('./routes/cache.route');
const greetRouter = require("./routes/greet.route");
const downloadRouter = require("./routes/download.route");
const { logger, requestTimingLogger } = require('./logger/logger');

app.use(express.json());

app.use(logger);

app.use("/greet",greetRouter);
app.use('/cache',cacheRouter);
app.use("/download",downloadRouter);

const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
