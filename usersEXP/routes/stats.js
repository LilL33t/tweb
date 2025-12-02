var express = require('express');
var router = express.Router();

const statsController = require('../controllers/stat');

router.get('/:animeId', statsController.getStatsByAnime);

module.exports = router;