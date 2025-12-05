var express = require('express');
var router = express.Router();
var axios = require('axios');
var aggregator = require('../services/animeAggregator');

// Config
const JPA_URL = 'http://127.0.0.1:8080/api';

// 1. SEARCH ROUTE (Forward to Java)
/*
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

 */


router.get('/search', async (req, res) => {
    try {
        // 1. Destructure all possible params
        const { q, genre, min_score, rating, favorites, year } = req.query;

        // 2. Call Spring Boot with ALL params
        const response = await axios.get('http://localhost:8080/api/animes/search', {
            params: {
                title: q,
                genre: genre,
                minScore: min_score,
                rating: rating,
                minFavorites: favorites
            }
        });

        // 3. Render 'index' (or 'home') with results
        // Note: We use 'topAnime' variable name for the grid to reuse the same HBS loop
        res.render('index', {
            title: "Search Results",
            topAnime: response.data,
            searchParams: req.query // Pass back params to keep form filled
        });

    } catch (err) {
        console.error("Search Error:", err.message);
        res.render('index', {
            topAnime: [],
            error: "Search unavailable."
        });
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