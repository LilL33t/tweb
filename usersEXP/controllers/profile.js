const Profile = require('../models/profile');


exports.getUserProfile = async (req, res) => {
    console.log("1. Request received for user:", req.params.username); // LOG 1

    try {
        //logs for debug
        console.log("2. Querying database...");

        const profile = await Profile.findOne({ username: req.params.username });

        console.log("3. Database answered:", profile); // LOG 3

        if (!profile) {
            console.log("4. User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("5. Sending response");
        res.json(profile);

    } catch (err) {
        console.error("ERROR in Controller:", err);
        res.status(500).json({ error: err.message });
    }
};