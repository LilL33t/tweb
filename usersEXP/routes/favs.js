var express = require('express');
var router = express.Router();

const favsController = require('../controllers/fav');

/**
 * @swagger
 * /api/favs/{username}:
 *   get:
 *     summary: Get User Favorites
 *     description: Retrieves the list of Anime IDs favorited by the user (fav_type = 'anime').
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
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The user who owns these favorites
 *                   example: "OtakuKing99"
 *                 count:
 *                   type: integer
 *                   description: Total number of favorites found
 *                   example: 4
 *                 favs:
 *                   type: array
 *                   description: List of Anime IDs
 *                   items:
 *                     type: integer
 *                     example: [21, 45, 103, 88]
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.get('/:username', favsController.getFavAnimeByUser);

module.exports = router;