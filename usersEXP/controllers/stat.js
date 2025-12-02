const Stats = require("../models/stat");

exports.getStatsByAnime = async (req, res) => {

    console.log("1. Request received for anime:", req.params.animeId);// LOG 1

    try{
        const id = parseInt(req.params.animeId);

        console.log("2. Querying database...");

        const stats = await Stats.findOne({mal_id : id});

        console.log("3. Database answered:", stats); // LOG 3

        if (!stats){
            console.log("4. Stats for Anime not found");
            return res.status(404).json({ message: " Stats for Anime not found" });
        }

        console.log("5. Sending response");
        res.json(stats);

    }catch(e){
        res.status(500).json({error: e.message});
    }
}