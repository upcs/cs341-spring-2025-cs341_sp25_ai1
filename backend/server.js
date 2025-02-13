const express = require('express'); // import express framework
const cors = require('cors'); // import cors to enable communication between frontend and backend
const app = express(); // create an express app instance

app.use(cors()); // enable cors to allow requests from different origins
app.use(express.json());

app.post('/api/generate', async (req, res) => {
    try {
        // this matches the frontend expected format
        const { model, prompt, stream } = req.body;
        
        // for now it just send back a test response matching the format
        const response = {
            response: `Test response to: ${prompt}`
        };
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 11434;  // using same port as the frontend code
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});