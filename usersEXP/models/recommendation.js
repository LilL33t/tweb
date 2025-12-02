const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema({
    mal_id: Number,
    recommendation_mal_id: Number,

}, {collection: 'recommendations'
});

module.exports = mongoose.model('recommendation', recommendationSchema);