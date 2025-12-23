var express = require('express');
var router = express.Router();

const statsController = require('../controllers/stat');

/**
 * @swagger
 * /api/stats/{animeId}:
 *   get:
 *     summary: Get Anime Statistics
 *     description: Retrieves detailed statistics including status counts and score breakdowns.
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The MAL ID of the anime
 *     responses:
 *       200:
 *         description: Statistical data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6928e91933265fab471f96f1"
 *                 mal_id:
 *                   type: integer
 *                   example: 20
 *                 watching:
 *                   type: integer
 *                   example: 218043
 *                 completed:
 *                   type: integer
 *                   example: 2473121
 *                 on_hold:
 *                   type: integer
 *                   example: 96432
 *                 dropped:
 *                   type: integer
 *                   example: 137128
 *                 plan_to_watch:
 *                   type: integer
 *                   example: 110802
 *                 total:
 *                   type: integer
 *                   example: 3035526
 *                 score_1_votes:
 *                   type: integer
 *                   example: 8177
 *                 score_1_percentage:
 *                   type: number
 *                   example: 0.4
 *                 score_2_votes:
 *                   type: integer
 *                   example: 4913
 *                 score_2_percentage:
 *                   type: number
 *                   example: 0.2
 *                 score_3_votes:
 *                   type: integer
 *                   example: 8554
 *                 score_3_percentage:
 *                   type: number
 *                   example: 0.4
 *                 score_4_votes:
 *                   type: integer
 *                   example: 21723
 *                 score_4_percentage:
 *                   type: number
 *                   example: 1.0
 *                 score_5_votes:
 *                   type: integer
 *                   example: 66550
 *                 score_5_percentage:
 *                   type: number
 *                   example: 3.2
 *                 score_6_votes:
 *                   type: integer
 *                   example: 162061
 *                 score_6_percentage:
 *                   type: number
 *                   example: 7.8
 *                 score_7_votes:
 *                   type: integer
 *                   example: 450128
 *                 score_7_percentage:
 *                   type: number
 *                   example: 21.6
 *                 score_8_votes:
 *                   type: integer
 *                   example: 577156
 *                 score_8_percentage:
 *                   type: number
 *                   example: 27.6
 *                 score_9_votes:
 *                   type: integer
 *                   example: 399966
 *                 score_9_percentage:
 *                   type: number
 *                   example: 19.2
 *                 score_10_votes:
 *                   type: integer
 *                   example: 389325
 *                 score_10_percentage:
 *                   type: number
 *                   example: 18.6
 *       500:
 *         description: Server Error
 */
router.get('/:animeId', statsController.getStatsByAnime);

module.exports = router;