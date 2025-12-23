var express = require('express');
var router = express.Router();
const profileController = require('../controllers/profile');
const ratingController = require('../controllers/rating');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieves detailed profile information including stats.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique username
 *     responses:
 *       200:
 *         description: User profile found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6928e91533265fab471f553a"
 *                 username:
 *                   type: string
 *                   example: "arizima23"
 *                 gender:
 *                   type: string
 *                   example: "Female"
 *                 birthday:
 *                   type: string
 *                   example: "Jun 23, 1998"
 *                 location:
 *                   type: string
 *                   example: "Spain"
 *                 joined:
 *                   type: string
 *                   example: "Mar 15, 2019"
 *                 watching:
 *                   type: string
 *                   description: Number of animes currently watching
 *                   example: "15"
 *                 completed:
 *                   type: string
 *                   description: Number of animes completed
 *                   example: "64"
 *                 on_hold:
 *                   type: string
 *                   example: "0"
 *                 dropped:
 *                   type: string
 *                   example: "4"
 *                 plan_to_watch:
 *                   type: string
 *                   example: "4"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.get('/:username', profileController.getUserProfile);

module.exports = router;
