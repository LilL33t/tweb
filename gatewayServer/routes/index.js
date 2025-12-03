var express = require('express');
var router = express.Router();
var aggregator = require('../services/animeAggregator');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Anime Analytics' });
});

/* GET Anime Detail Page (NEW) */
router.get('/anime/:id', async function(req, res) {
    try {
        const data = await aggregator.getFullAnimeDetails(req.params.id);

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
            scoreDistribution: scoreDistribution
        });
    } catch (err) {
        res.render('error', { message: "Server Error", error: err });
    }
});

module.exports = router;