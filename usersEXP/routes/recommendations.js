var express = require('express');
var router = express.Router();

const recommendationController = require('../controllers/recommendation');

router.get('/:animeId', recommendationController.getRecommendationsByAnime);

module.exports = router;