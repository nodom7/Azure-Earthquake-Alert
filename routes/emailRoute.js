const express = require('express');
const router = express.Router();
const { addEmailToDatabase } = require('../services/cosmosService');

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const result = await addEmailToDatabase(email);
        res.status(201).json({ message: 'Email added successfully', id: result.id });
    } catch (error) {
        console.error('Error adding email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;