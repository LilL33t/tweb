const Rating = require('../models/rating');

exports.getRatingByAnime = async (req, res) => {
    console.log("1. Request received for anime:", req.params.animeId); // LOG 1

    try {
        const animeId = parseInt(req.params.animeId);
        const requestedScore = req.query.score; // Get the score from URL (e.g. ?score=10)

        // 1. Pagination Config
        // Default to Page 1, Limit 6 items per page (fits 2 rows of 3 columns nicely)
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        // 2. Build Query
        let query = { anime_id: animeId };
        if (requestedScore) {
            query.score = parseInt(requestedScore);
        } else {
            query.score = { $gt: 0 };
        }

        // 3. Run Query with Skip/Limit
        const ratings = await Rating.find(query)
            .select('username score status num_watched_episodes')
            .sort({ _id: -1 }) // Newest first
            .skip(skip)        // <--- Skip previous pages
            .limit(limit)      // <--- Only fetch 6
            .lean();

        res.json(ratings || []);

    } catch (e) {
        console.error("Controller Error:", e);
        res.status(500).json({ error: e.message });
    }
}