const Rating = require('../models/rating');

exports.getRatingByAnime = async (req, res) => {
    console.log("1. Request received for anime:", req.params.animeId); // LOG 1

    try{
        const animeId = parseInt(req.params.animeId);

        //logs for debug
        console.log("2. Querying database...");

        const ratings = await Rating.find({anime_id: animeId, score: {$gt: 0} }).sort({score: -1}).limit(1000);
        //-> only valid scores >= (gt) 0, sorted by score (10--->1), limit number of "grabbed" records to N = 50

        console.log("3. Database answered:", ratings); // LOG 3

        if (!ratings) {
            console.log("4. Ratings for Anime not found");
            return res.status(404).json({ message: "Ratings for Anime not found" });
        }

        console.log("5. Sending response");
        res.json(ratings);

    }catch(e){
        res.status(500).json({error: e.message});
    }
}