var express = require('express');
var router = express.Router();
var axios = require('axios');

// Config
const JPA_URL = 'http://127.0.0.1:8080/api';
const NODE_URL = 'http://127.0.0.1:3001/api';

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Anime search and discovery endpoints
 *   - name: Reviews
 *     description: User reviews and ratings management
 *   - name: User
 *     description: User profiles and favorites
 *   - name: Characters
 *     description: Anime character details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Anime:
 *       type: object
 *       properties:
 *         episodes:
 *           type: integer
 *           example: 1
 *         favorites:
 *           type: integer
 *           example: 1
 *         genres:
 *           type: string
 *           nullable: true
 *           example: "Adventure, Fantasy"
 *         imageUrl:
 *           type: string
 *           example: "https://cdn.myanimelist.net/images/anime/1435/127940.jpg"
 *         licensors:
 *           type: string
 *           nullable: true
 *           example: "Unito licensors"
 *         malId:
 *           type: integer
 *           example: 45060
 *         producers:
 *           type: string
 *           nullable: true
 *           example: "Unito producers"
 *         rating:
 *           type: string
 *           example: "PG - Children"
 *         score:
 *           type: number
 *           nullable: true
 *           example: 9.1
 *         season:
 *           type: string
 *           nullable: true
 *           example: "fall"
 *         source:
 *           type: string
 *           example: "Manga"
 *         status:
 *           type: string
 *           example: "Finished Airing"
 *         studios:
 *           type: string
 *           nullable: true
 *           example: "Unito Studios"
 *         synopsis:
 *           type: string
 *           nullable: true
 *           example: "Cool anime"
 *         title:
 *           type: string
 *           example: "Alibaba Sangen Jinfa"
 *         titleJapanese:
 *           type: string
 *           example: "阿里巴巴三根金发"
 *         type:
 *           type: string
 *           example: "Movie"
 *         year:
 *           type: integer
 *           nullable: true
 *           example: 1991
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6928e91533265fab471f513f"
 *         username:
 *           type: string
 *           example: "annyn"
 *         gender:
 *           type: string
 *           example: "Female"
 *         birthday:
 *           type: string
 *           nullable: true
 *           example: "Aug 21, 1998"
 *         location:
 *           type: string
 *           example: "Indonesia"
 *         joined:
 *           type: string
 *           example: "Sep 20, 2021"
 *         watching:
 *           type: string
 *           example: "2"
 *         completed:
 *           type: string
 *           example: "401"
 *         on_hold:
 *           type: string
 *           example: "24"
 *         dropped:
 *           type: string
 *           example: "24"
 *         plan_to_watch:
 *           type: string
 *           example: "40"
 *
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6928f0d233265fab47c4e7c7"
 *         username:
 *           type: string
 *           example: "annyn"
 *         status:
 *           type: string
 *           example: "dropped"
 *         score:
 *           type: integer
 *           example: 2
 *         num_watched_episodes:
 *           type: integer
 *           example: 4
 *         userProfile:
 *           $ref: '#/components/schemas/UserProfile'
 *           
 *     Character:
 *       type: object
 *       properties:
 *         about:
 *           type: string
 *           example: "Birthdate: June 26, 2044\nHeight: 185 cm (6' 1\")\nWeight: 70 kg (155 lbs)\nBlood type: O\nPlanet of Origin: Mars\n\nSpike Spiegel is a tall and lean 27-year-old bounty hunter born on Mars. The inspiration for Spike is found in martial artist Bruce Lee who uses the martial arts style of Jeet Kune Do as depicted in Session 8, \"Waltz For Venus\". He has fluffy, dark green hair (which is inspired by Yusaku Matsuda's) and reddish brown eyes, one of which is artificial and lighter than the other. He is usually dressed in a blue leisure suit, with a yellow shirt and Lupin III inspired boots. A flashback in Session 6 revealed it was his fully functioning right eye which was surgically replaced by the cybernetic one (although Spike himself may not have conscious recollection of the procedure since he claims to have lost his natural eye in an \"accident\"). One theory is that his natural eye may have been lost during the pre-series massacre in which he supposedly \"died\". The purpose of this cybernetic eye is never explicitly stated, though it apparently gives him exceptional hand-eye coordination - particularly with firearms (Spike's gun of choice is a Jericho 941, as seen throughout the series). In the first episode, when facing a bounty-head using Red Eye, Spike mocks him, calling his moves \"too slow\". At first, this seems like posturing on Spike's part, but even with his senses and reflexes accelerated to superhuman levels by the drug, the bounty cannot even touch Spike. A recurring device throughout the entire show is a closeup on Spike's fully-natural left eye before dissolving to a flashback of his life as part of the syndicate. As said by Spike himself in the last episode, his right eye \"only sees the present\" and his left eye \"only sees the past.\" Spike often has a bent cigarette between his lips, sometimes despite rain or \"No Smoking\" signs."
 *         favorites:
 *           type: integer
 *           example: 48344
 *         id:
 *           type: integer
 *           example: 1
 *         image:
 *           type: string
 *           example: "https://cdn.myanimelist.net/images/characters/11/516853.jpg"
 *         name:
 *           type: string
 *           example: "Spike Spiegel"
 *         nameKanji:
 *           type: string
 *           example: "スパイク・スピーゲル"
 *         url:
 *           type: string
 *           example: "https://myanimelist.net/character/1/Spike_Spiegel"
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for Animes
 *     description: Proxies the search request to the Java Microservice and returns detailed anime objects.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The title or keyword to search for
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: min_score
 *         schema:
 *           type: number
 *         description: Minimum score (0-10)
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *         description: Age Rating (e.g., PG-13)
 *     responses:
 *       200:
 *         description: A list of animes found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Anime'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', async function(req, res) {
    try {
        const response = await axios.get(`${JPA_URL}/animes/search`, {
            params: req.query
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/reviews/{animeId}:
 *   get:
 *     summary: Get Reviews with User Profile
 *     description: Fetches reviews/ratings and enriches them with detailed user profile data.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The MAL ID of the anime
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *         description: Filter by score (1-10)
 *     responses:
 *       200:
 *         description: List of reviews with embedded user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reviews/:animeId', async function(req, res) {
    try {
        const { animeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const score = req.query.score;

        const response = await axios.get(`${NODE_URL}/ratings/${animeId}`, {
            params: { score, page }
        });

        const reviews = response.data;

        if (reviews && reviews.length > 0) {
            await Promise.all(reviews.map(async (review) => {
                try {
                    const userRes = await axios.get(`${NODE_URL}/users/${review.username}`);
                    review.userProfile = userRes.data;
                } catch (err) {
                    review.userProfile = null;
                }
            }));
        }
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/users/{username}/favorites:
 *   get:
 *     summary: Get User Favorites
 *     description: Fetches IDs from MongoDB and resolves details from SQL.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to lookup
 *     responses:
 *       200:
 *         description: List of favorite animes with full details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Anime'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users/:username/favorites', async (req, res) => {
    try {
        const { username } = req.params;

        const favsResponse = await axios.get(`${NODE_URL}/favs/${username}`);
        const favData = favsResponse.data;
        const ids = (favData && Array.isArray(favData.favs)) ? favData.favs : [];

        if (ids.length === 0) return res.json([]);

        const limitIds = ids.slice(0, 5);
        const detailsResponse = await axios.get(`${JPA_URL}/animes/batch`, {
            params: { ids: limitIds.join(',') }
        });

        res.json(detailsResponse.data);
    } catch (err) {
        console.error("Error fetching user favorites:", err.message);
        res.json([]);
    }
});

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get Character Details
 *     description: Fetches detailed information about a specific anime character.
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Character MAL ID
 *     responses:
 *       200:
 *         description: Character details object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/characters/:id', async function(req, res) {
    try {
        const { id } = req.params;
        const response = await axios.get(`${JPA_URL}/characters/${id}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch character details" });
    }
});

/**
 * @swagger
 * /api/top:
 *   get:
 *     summary: Get Top Anime
 *     description: Fetches top ranked anime from SQL (via Java Service).
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: A list of animes found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Anime'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/top', async function(req, res) {
    try {
        const page = req.query.page || 1;
        const response = await axios.get(`${JPA_URL}/animes/top`, {
            params: { page: page }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top anime" });
    }
});

module.exports = router;
