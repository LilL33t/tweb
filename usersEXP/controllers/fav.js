const Fav = require('../models/Fav');

exports.getFavAnimeByUser = async (req, res) => {
    console.log("1. Request received for user:", req.params.username); // LOG 1

    try{
        const username = req.params.username;

        //logs for debug
        console.log("2. Querying database...");

        const favs = await Fav.find({username: username, fav_type : "anime"}).select('id -_id').limit(100);
        //-> we only look for anime watchers, hide mogo '_-id' and limit records to 100 a time

        console.log("3. Database answered:", favs); // LOG 3

        if (!favs) {
            console.log("4. Anime for User not found");
            return res.status(404).json({ message: "Anime for User not found" });
        }

        console.log("5. Mapping it to a list of anime_id(s)");
        //for a better format json we map it
        const animeIds = favs.map(f => f.id);

        console.log("6. Sending response");
        res.json({
            username: username,
            count: animeIds.length,
            favs: animeIds
        });

    }catch(e){
        res.status(500).json({error: e.message});
    }
}