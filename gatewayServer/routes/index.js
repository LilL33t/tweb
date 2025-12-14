/* gatewayServer/routes/index.js */
var express = require('express');
var router = express.Router();
var aggregator = require('../services/animeAggregator');
var axios = require('axios');

/* 1. HOMEPAGE (Initial Load) */
router.get('/', async function(req, res) {
    try {
        // Just load the default Top 12 for the first paint
        const response = await axios.get('http://localhost:8080/api/animes/top', {
            params: { page: 1 }
        });

        res.render('index', {
            title: 'Anime Analytics',
            topAnime: response.data,
            // We only need basic pagination for the initial list
            currentPage: 1,
            nextPage: 2,
            prevPage: null,
            showPrev: false
        });

    } catch (err) {
        console.error("Gateway Error:", err.message);
        res.render('index', { topAnime: [], error: "Service unavailable" });
    }
});

/* 2. ANIME DETAILS PAGE (Page Shell) */
router.get('/anime/:id', async function(req, res) {
    try {
        // We NO LONGER need query params for score/page here.
        // The client (main.js) will fetch reviews separately.
        const data = await aggregator.getFullAnimeDetails(req.params.id);

        if (!data) return res.render('error', { message: "Anime Not Found" });

        // Calculate Score Distribution (Keep this server-side, it's fast)
        const scoreDistribution = [];
        for (let i = 10; i >= 1; i--) {
            const pct = data.stats[`score_${i}_percentage`] || 0;
            const votes = data.stats[`score_${i}_votes`] || 0;
            let color = i >= 8 ? 'success' : (i >= 5 ? 'warning' : 'danger');
            scoreDistribution.push({ score: i, percentage: pct, votes: votes, color: color });
        }

        res.render('details', {
            title: data.animeData.title,
            anime: data.animeData,
            stats: data.stats,
            // reviews: [], // REMOVED: Main.js will fetch these!
            recommendations: data.recommendations,
            characters: data.characters,
            staff: data.staff,
            voices: data.voices,
            scoreDistribution: scoreDistribution,
        });
    } catch (err) {
        res.render('error', { message: "Server Error", error: err });
    }
});

/* 3. API: SEARCH (Used by main.js) */
router.get('/api/search', async function(req, res) {
    try {
        const response = await axios.get('http://127.0.0.1:8080/api/animes/search', {
            params: req.query // Forward q, genre, rating, page...
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* 4. API: REVIEWS (Used by main.js) */
router.get('/api/reviews/:animeId', async function(req, res) {
    try {
        const { animeId } = req.params;
        const { score } = req.query;

        // 1. Log to Gateway Terminal to prove request arrived
        console.log(`[Gateway] Fetching reviews for ID: ${animeId}`);

        // Call Node Service
        const response = await axios.get(`http://127.0.0.1:3001/api/ratings/${animeId}`, {
            params: { score: score }
        });

        const reviews = response.data;

        // Enrich with User Profiles (Moved here from Aggregator)
        if (reviews && reviews.length > 0) {
            await Promise.all(reviews.map(async (review) => {
                try {
                    const userRes = await axios.get(`http://127.0.0.1:3001/api/users/${review.username}`);
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

module.exports = router;