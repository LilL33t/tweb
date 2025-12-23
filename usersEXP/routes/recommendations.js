var express = require('express');
var router = express.Router();

const recommendationController = require('../controllers/recommendation');

/**
 * @swagger
 * /api/recommendations/{animeId}:
 *   get:
 *     summary: Get Anime Recommendations
 *     description: Retrieves a list of recommendation links (pairs of anime IDs).
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The MAL ID of the source anime
 *     responses:
 *       200:
 *         description: List of recommended anime pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6928e91a33265fab4720c591"
 *                   mal_id:
 *                     type: integer
 *                     description: The source Anime ID
 *                     example: 20
 *                   recommendation_mal_id:
 *                     type: integer
 *                     description: The recommended Anime ID
 *                     example: 34572
 *       500:
 *         description: Server Error
 */
router.get('/:animeId', recommendationController.getRecommendationsByAnime);

module.exports = router;