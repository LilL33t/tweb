const axios = require('axios');

// --- CONFIGURATION ---
// We MUST use 127.0.0.1 to avoid connection errors
const JPA_URL  = 'http://127.0.0.1:8080/api';
const EXP_URL = 'http://127.0.0.1:3001/api';

exports.getFullAnimeDetails = async (id, scoreFilter, page = 1) => {

    try {

        const animeResponse = await axios.get(`${JPA_URL}/animes/${id}`);
        const animeData = animeResponse.data;


        const [stats, reviews, recs, characters, staff, voices, profiles] = await Promise.all([
            // Stats
            axios.get(`${EXP_URL}/stats/${id}`)
                .then(res => res.data)
                .catch(err => {
                    console.error(" -> Stats failed:", err.message);
                    return {}; // Return empty stats if failed
                }),

            // Ratings
            axios.get(`${EXP_URL}/ratings/${id}`, {
                    params: {score: scoreFilter,
                             page: page // <-- passing the page
                    }
                })
                .then(res => res.data)
                .catch(err => {
                    console.error(" -> Reviews failed:", err.message);
                    return []; // Return empty ratings if failed
                }),

            // Recommendations
            axios.get(`${EXP_URL}/recommendations/${id}`)
                .then(res => res.data)
                .catch(err => {
                    console.error(" -> Recs failed:", err.message);
                    return []; // Return empty recs if failed
                }),

            //Cast
            axios.get(`${JPA_URL}/animes/${id}/characters`)
                .then(res => res.data)
                .catch(err => {
                console.error(" -> Recs failed:", err.message);
                return []; // Return empty recs if failed
                }),

            //Staff
            axios.get(`${JPA_URL}/animes/${id}/staff`)
                .then(res => res.data)
                .catch(err => {
                    console.error(" -> Recs failed:", err.message);
                    return []; // Return empty recs if failed
                }),

            //Voices
            axios.get(`${JPA_URL}/animes/${id}/voices`)
                .then(res => res.data)
                .catch(err => {
                    console.error(" -> Recs failed:", err.message);
                    return []; // Return empty recs if failed
                }),
        ]);

        if (reviews && reviews.length > 0) {
            // We replace the original 'reviews' array with a new "Enriched" array
            // that contains the user profile inside each review object
            await Promise.all(reviews.map(async (review) => {
                try {
                    // Fetch profile for THIS specific review's username
                    const userRes = await axios.get(`${EXP_URL}/users/${review.username}`);
                    review.userProfile = userRes.data; // Attach profile to the review object
                } catch (err) {
                    review.userProfile = null; // Handle missing users safely
                }
            }));
        }

        console.log(`Success! Merging data for ID ${id}`);

        // 3. Merge and Return
        return {
            animeData: animeData,
            stats: stats,
            ratings: reviews,
            recommendations: recs,
            characters: characters,
            staff: staff,
            voices: voices,
        };

    } catch (error) {
        console.error(`CRITICAL ERROR for ID ${id}:`, error.message);
        return null;
    }
};