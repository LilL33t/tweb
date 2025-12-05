var express = require('express');
var router = express.Router();

const ratingController = require('../controllers/rating');



//router.get('/:animeId', ratingController.getRatingByAnime);

router.get('/:animeId', ratingController.getRatingByAnime);

module.exports = router;