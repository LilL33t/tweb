var express = require('express');
var router = express.Router();
var axios = require('axios');
var aggregator = require('../services/animeAggregator');

// Config
const JPA_URL = 'http://127.0.0.1:8080/api';

/* 1. HOMEPAGE */
router.get('/', async function(req, res) {
    try {
        const response = await axios.get(`${JPA_URL}/animes/top`, {
            params: { page: 1 }
        });

        res.render('index', {
            title: 'Anime Analytics',
            topAnime: response.data,
            currentPage: 1,
            nextPage: 2,
            prevPage: null,
            showPrev: false
        });
    } catch (err) {
        console.error("Home Error:", err.message);
        res.render('index', { topAnime: [], error: "Service unavailable" });
    }
});

/* 2. SEARCH PAGE (Full Page Load) */
router.get('/search', async (req, res) => {
    try {
        const { q, genre, min_score, rating, favorites } = req.query;

        const response = await axios.get(`${JPA_URL}/animes/search`, {
            params: {
                title: q,
                genre: genre,
                minScore: min_score,
                rating: rating,
                minFavorites: favorites
            }
        });

        res.render('index', {
            title: "Search Results",
            topAnime: response.data,
            searchParams: req.query
        });
    } catch (err) {
        console.error("Search Page Error:", err.message);
        res.render('index', { topAnime: [], error: "Search unavailable." });
    }
});

/* 3. DETAILS PAGE */
router.get('/anime/:id', async function(req, res) {
    try {
        const data = await aggregator.getFullAnimeDetails(req.params.id);

        if (!data) return res.render('error', { message: "Anime Not Found" });

        // --- Data Formatting Logic ---
        const scoreDistribution = [];
        let totalVotes = 0;

        for (let i = 10; i >= 1; i--) {
            const pct = data.stats[`score_${i}_percentage`] || 0;
            const votes = data.stats[`score_${i}_votes`] || 0;
            totalVotes += votes;
            let color = (i >= 8) ? 'success' : (i >= 5) ? 'warning' : 'danger';
            scoreDistribution.push({ score: i, percentage: pct, votes: votes, color: color });
        }

        const fmt = (n) => n ? n.toLocaleString() : "0";
        totalVotes = fmt(totalVotes);
        data.animeData.favorites = fmt(data.animeData.favorites);
        data.stats.watching = fmt(data.stats.watching);
        data.stats.completed = fmt(data.stats.completed);
        data.stats.total = fmt(data.stats.total);

        res.render('details', {
            title: data.animeData.title,
            anime: data.animeData,
            stats: data.stats,
            recommendations: data.recommendations,
            characters: data.characters,
            staff: data.staff,
            voices: data.voices,
            scoreDistribution: scoreDistribution,
            totalVotes: totalVotes,
        });
    } catch (err) {
        res.render('error', { message: "Server Error", error: err });
    }
});

module.exports = router;