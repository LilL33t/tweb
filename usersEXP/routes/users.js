var express = require('express');
var router = express.Router();
const profileController = require('../controllers/profile');
const ratingController = require('../controllers/rating');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username', profileController.getUserProfile);


module.exports = router;
