var express = require('express');
var router = express.Router();
var axios = require('axios');
var aggregator = require('../services/animeAggregator');

// Config
const JPA_URL = 'http://127.0.0.1:8080/api';

// 1. SEARCH ROUTE (Forward to Java)
router.get('/search', async function(req, res) {
    try {
        const query = req.query.title;
        // Simple forward
        const response = await axios.get(`${JPA_URL}/animes/search?title=${query}`);
        res.json(response.data);
    } catch (err) {
        // If Java replied with an error (like 404), pass that status.
        // If Java is down, send 500.
        const status = err.response ? err.response.status : 500;
        res.status(status).json({ error: "Search failed", details: err.message });
    }
});

// 2. DETAILS ROUTE (Aggregator)
router.get('/anime/:id', async function(req, res) {
    try {
        const data = await aggregator.getFullAnimeDetails(req.params.id);

        if (!data) return res.status(404).json({ error: "Anime not found" });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;