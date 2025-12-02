var express = require('express');
var router = express.Router();

const favsController = require('../controllers/fav');

router.get('/:username', favsController.getFavAnimeByUser);

module.exports = router;