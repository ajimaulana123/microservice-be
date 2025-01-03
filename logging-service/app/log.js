const express = require('express');
const app = express();
const port = 5003;

let logs = [];

app.use(express.json());

app.post('/log', (req, res) => {
    const logEntry = req.body;
    logs.push(logEntry);
    res.status(201).send('Log saved');
});

app.get('/logs', (req, res) => {
    res.json(logs);
});

app.listen(port, () => {
    console.log(`Logging Service running on port ${port}`);
});
