const express = require('express');
const app = express();
const dataBase = require('./database/database');
require('dotenv').config();

// Route for /ping with basic error handling
app.get('/ping', (req, res) => {
    try {
        res.send('Pong!');
    } catch (error) {
        res.status(500).send('An error occurred!');
    }
});

dataBase();
// Use an environment variable for the port with a fallback to 8000
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});