var express = require('express');
var router = express.Router();

const ratingController = require('../controllers/rating');



//router.get('/:animeId', ratingController.getRatingByAnime);

/**
 * @swagger
 * /api/ratings/{animeId}:
 *   get:
 *     summary: Get User Ratings
 *     description: Fetches user ratings for a specific anime. Returns metadata like score and status (watching/completed), but not the text review.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The MAL ID of the anime
 *       - in: query
 *         name: score
 *         schema:
 *           type: integer
 *         description: Filter by specific score (1-10)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (Default is 1, returns 6 items per page)
 *     responses:
 *       200:
 *         description: List of ratings found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65b8e..."
 *                   username:
 *                     type: string
 *                     example: "OtakuKing99"
 *                   status:
 *                     type: string
 *                     example: "completed"
 *                   score:
 *                     type: integer
 *                     example: 10
 *                   num_watched_episodes:
 *                     type: integer
 *                     example: 24
 *       500:
 *         description: Server Error
 */
router.get('/:animeId', ratingController.getRatingByAnime);

module.exports = router;