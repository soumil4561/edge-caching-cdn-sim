const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
    res.send("Hello!!");
})

app.listen(8080, () => {
    console.log('Backend server running on http://localhost:8080');
});
