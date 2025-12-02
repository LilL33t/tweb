const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    username: {type: String, required: true, index: true},
    anime_id: {type: Number, required: true, index: true},
    status: String,
    score: {type: Number, index: true},
    is_rewatching: Boolean,
    num_watched_episodes: Number,

}, {collection: 'ratings'
});

module.exports = mongoose.model('rating', ratingSchema);