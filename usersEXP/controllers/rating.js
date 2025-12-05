const Rating = require('../models/rating');

exports.getRatingByAnime = async (req, res) => {
    console.log("1. Request received for anime:", req.params.animeId); // LOG 1

    try {
        const animeId = parseInt(req.params.animeId);
        const requestedScore = req.query.score; // Get the score from URL (e.g. ?score=10)

        // 1. Build the Query Object dynamically
        let query = { anime_id: animeId };

        if (requestedScore) {
            // CASE A: User selected a specific score (Dropdown/Bar Click)
            query.score = parseInt(requestedScore);

        } else {
            // CASE B: Default load (Show all valid scores)
            query.score = { $gt: 0 };

        }

        // 2. Run Query
        // We use .lean() for performance
        const ratings = await Rating.find(query)
            .sort({ _id: -1 }) // Sort by Newest (using _id is faster than date)
            .limit(20)         // Limit is crucial for performance
            .lean();

        // 3. Send Response
        res.json(ratings || []);

    } catch (e) {
        console.error("Controller Error:", e);
        res.status(500).json({ error: e.message });
    }
}