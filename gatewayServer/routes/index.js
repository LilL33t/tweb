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

        // --- CALCULATE SCORE DISTRIBUTION & TOTAL VOTES ---
        const scoreDistribution = [];
        let totalVotes = 0; // Initialize counter

        for (let i = 10; i >= 1; i--) {
            const pct = data.stats[`score_${i}_percentage`] || 0;
            const votes = data.stats[`score_${i}_votes`] || 0;

            // Add to total
            totalVotes += votes;

            let color = 'danger';
            if (i >= 8) color = 'success';
            else if (i >= 5) color = 'warning';

            scoreDistribution.push({ score: i, percentage: pct, votes: votes, color: color });
        }

        // ---  FORMAT NUMBERS WITH COMMAS ---
        // Helper function: if n exists, format it; otherwise return "0"
        const fmt = (n) => n ? n.toLocaleString() : "0";

        //Format Total Views
        totalVotes = fmt(totalVotes);

        // Format Anime Stats
        // We overwrite the existing values with the formatted string versions
        data.animeData.favorites = fmt(data.animeData.favorites);

        // Format Usage Stats
        data.stats.watching = fmt(data.stats.watching);
        data.stats.completed = fmt(data.stats.completed);
        data.stats.total = fmt(data.stats.total);


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
            totalVotes: totalVotes,
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
        // 1. Get page from query (default to 1)
        const page = parseInt(req.query.page) || 1;

        console.log(`[Gateway] Fetching reviews for ID: ${animeId}, Page: ${page}`);

        // 2. Call Node Service WITH PAGE PARAM
        // Note: Your internal service (Port 3001) must support ?page=X
        const response = await axios.get(`http://127.0.0.1:3001/api/ratings/${animeId}`, {
            params: {
                score: score,
                page: page // <--- Forwarding the page
            }
        });

        const reviews = response.data;

        // 3. Enrich with User Profiles
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

    /* gatewayServer/routes/index.js */

// 5. GET User Favorites (Resolved with Images/Titles)
    // GET User Favorites (Resolved with Images/Titles)
    router.get('/api/users/:username/favorites', async (req, res) => {
        try {
            const { username } = req.params;

            // 1. Get User's Favorites from Node Service
            const favsResponse = await axios.get(`http://127.0.0.1:3001/api/favs/${username}`);
            const favData = favsResponse.data;

            // --- DEBUG: Log what we got ---
            // console.log(`[Gateway] Node response:`, favData);

            // 2. Extract IDs
            // Your controller returns: { username: "...", count: X, favs: [id1, id2, ...] }
            let ids = [];

            if (favData && Array.isArray(favData.favs)) {
                // The controller already mapped them to IDs! We just take them.
                ids = favData.favs;
            } else {
                console.log("[Gateway] No 'favs' array found in response.");
                return res.json([]);
            }

            // Limit to 5 for the modal
            //ids = ids.slice(0, 5);

            if (ids.length === 0) {
                return res.json([]);
            }

            // 3. Resolve details using the Java Service
            // We pass the IDs directly since they are already numbers
            const detailsResponse = await axios.get(`http://127.0.0.1:8080/api/animes/batch`, {
                params: { ids: ids.join(',') }
            });

            // 4. Return the resolved list (images, titles, etc.)
            res.json(detailsResponse.data);

        } catch (err) {
            if (err.response && err.response.status === 404) {
                return res.json([]);
            }
            console.error("Error fetching user favorites:", err.message);
            res.json([]);
        }
    });
});

/* 6. API: GET Character Details (About Text) */
router.get('/api/characters/:id', async function(req, res) {
    try {
        const { id } = req.params;

        // Forward request to Spring Boot (JPA)
        const response = await axios.get(`http://127.0.0.1:8080/api/characters/${id}`);

        res.json(response.data);
    } catch (err) {
        console.error(`Error fetching character ${req.params.id}:`, err.message);
        res.status(500).json({ error: "Failed to fetch character details" });
    }
});


module.exports = router;