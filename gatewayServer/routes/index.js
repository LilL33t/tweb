var express = require('express');
var router = express.Router();
var aggregator = require('../services/animeAggregator');
var axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        // 3. Request the "Top 12" from your Spring Boot Service
        // Ensure this URL matches your Java Controller's @RequestMapping + @GetMapping
        const response = await axios.get('http://localhost:8080/api/animes/top', {
            params: {page: page}
        });

        // 4. Render the 'index' view with the data
        res.render('index', {
            title: 'Anime Analytics',
            topAnime: response.data,

            //pagination
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
            showPrev: page > 1
        });

    } catch (err) {
        console.error("Gateway Error: Could not fetch top anime.", err.message);

        // 5. If Java server is down, still render the page (empty list) so it doesn't crash
        res.render('index', {
            title: 'Anime Analytics',
            topAnime: [],
            error: "Service currently unavailable"
        });
    }
});

/* GET Anime Detail Page (NEW) */
router.get('/anime/:id', async function(req, res) {
    try {
        const scoreFilter = req.query.score;

        const data = await aggregator.getFullAnimeDetails(req.params.id, scoreFilter);

        if (!data) return res.render('error', { message: "Anime Not Found", error: { status: 404 } });


        // We create a clean array [ {score:10, pct: 20, color: 'success'}, ... ]
        const scoreDistribution = [];
        for (let i = 10; i >= 1; i--) {
            const pct = data.stats[`score_${i}_percentage`] || 0;
            const votes = data.stats[`score_${i}_votes`] || 0;

            let color = 'danger'; // Red (1-4)
            if (i >= 8) color = 'success'; // Green (8-10)
            else if (i >= 5) color = 'warning'; // Yellow (5-7)

            scoreDistribution.push({ score: i, percentage: pct, votes: votes, color: color });
        }

        // Render the 'details.hbs' file with the data
        res.render('details', {
            title: data.animeData.title,
            anime: data.animeData,
            stats: data.stats,
            reviews: data.ratings,
            characters: data.characters,
            staff: data.staff,
            voices: data.voices,
            scoreDistribution: scoreDistribution,
            selectedScore: scoreFilter
        });
    } catch (err) {
        res.render('error', { message: "Server Error", error: err });
    }
});

router.get('/api/ratings/:id', async (req, res) => {
    try {
        // 1. CAPTURE: Read the score from the Browser's request
        // req.query holds everything after the '?' (e.g., ?score=10)
        const scoreFromBrowser = req.query.score;

        console.log(`[Gateway] Received request for ID ${req.params.id}. Filter Score: ${scoreFromBrowser}`);

        // 2. FORWARD: Send it to the Service
        const response = await axios.get(`http://127.0.0.1:3001/api/ratings/${req.params.id}`, {
            // 'params' automatically adds the ?score=X to the URL
            params: {
                score: scoreFromBrowser
            }
        });

        console.log(`[Gateway] Service responded with ${response.data.length} items`);

        // 3. RETURN: Send the Service's answer back to the Browser
        res.json(response.data);

    } catch (err) {
        console.error("Gateway Proxy Error:", err.message);
        // Return empty array so frontend doesn't crash
        res.json([]);
    }
});

router.get('/search', async (req, res) => {
    try {
        // 1. Destructure all possible params and get current page
        const page = parseInt(req.query.page) || 1;
        const { q, genre, min_score, rating, favorites, year } = req.query;


        // 2. Call Spring Boot with ALL params
        const response = await axios.get('http://localhost:8080/api/animes/search', {
            params: {
                title: q,
                genre: genre,
                minScore: min_score,
                rating: rating,
                minFavorites: favorites,
                page: page
            }
        });

        // 3. Render 'index' (or 'home') with results
        // Note: We use 'topAnime' variable name for the grid to reuse the same HBS loop
        res.render('index', {
            title: "Search Results",
            topAnime: response.data,
            searchParams: req.query,// Pass back params to keep form filled
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
            showPrev: page > 1
        });

    } catch (err) {
        console.error("Search Error:", err.message);
        res.render('index', {
            topAnime: [],
            error: "Search unavailable."
        });
    }
});

module.exports = router;