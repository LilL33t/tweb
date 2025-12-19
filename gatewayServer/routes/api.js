var express = require('express');
var router = express.Router();
var axios = require('axios');

// Config
const JPA_URL = 'http://127.0.0.1:8080/api';
const NODE_URL = 'http://127.0.0.1:3001/api';

/* 1. SEARCH API (For AJAX/Pagination) */
router.get('/search', async function(req, res) {
    try {
        const response = await axios.get(`${JPA_URL}/animes/search`, {
            params: req.query
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 2. REVIEWS API */
router.get('/reviews/:animeId', async function(req, res) {
    try {
        const { animeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const score = req.query.score;

        // Call Node Service
        const response = await axios.get(`${NODE_URL}/ratings/${animeId}`, {
            params: { score, page }
        });

        const reviews = response.data;

        // Enrich with User Profiles
        if (reviews && reviews.length > 0) {
            await Promise.all(reviews.map(async (review) => {
                try {
                    const userRes = await axios.get(`${NODE_URL}/users/${review.username}`);
                    review.userProfile = userRes.data;
                } catch (err) {
                    review.userProfile = null;
                }
            }));
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 3. USER FAVORITES API */
router.get('/users/:username/favorites', async (req, res) => {
    try {
        const { username } = req.params;

        // 1. Get IDs from Node
        const favsResponse = await axios.get(`${NODE_URL}/favs/${username}`);
        const favData = favsResponse.data;
        const ids = (favData && Array.isArray(favData.favs)) ? favData.favs : [];

        if (ids.length === 0) return res.json([]);

        // 2. Resolve Details from Java (Limit to 5 for modal)
        const limitIds = ids.slice(0, 5);
        const detailsResponse = await axios.get(`${JPA_URL}/animes/batch`, {
            params: { ids: limitIds.join(',') }
        });

        res.json(detailsResponse.data);
    } catch (err) {
        console.error("Error fetching user favorites:", err.message);
        res.json([]);
    }
});

/* 4. CHARACTER DETAILS API (About Text) */
router.get('/characters/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const response = await axios.get(`${JPA_URL}/characters/${id}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch character details" });
    }
});

/* 5. TOP ANIME API (For Homepage Pagination) */
router.get('/top', async function(req, res) {
    try {
        const page = req.query.page || 1;
        // Forward to the same JPA endpoint your Homepage uses
        const response = await axios.get(`${JPA_URL}/animes/top`, {
            params: { page: page }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top anime" });
    }
});

module.exports = router;