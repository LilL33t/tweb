const Recommendations = require('../models/recommendation');

exports.getRecommendationsByAnime = async (req, res) =>{

    console.log("1. Request received for anime:", req.params.animeId); // LOG 1

    try{
        const id = parseInt(req.params.animeId);

        console.log("2. Querying database...");

        const recs = await Recommendations.find({mal_id: id}).limit(10);

        console.log("3. Database answered:", recs); // LOG 3

        if (!recs){
            console.log("4. Recommendation for Anime not found");
            return res.status(404).json({ message: " Recommendation for Anime not found" });
        }

        console.log("5. Sending response");
        res.json(recs);
    }catch(e){
        res.status(500).json({error: e.message});
    }
}