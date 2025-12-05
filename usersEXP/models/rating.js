const mongoose = require('mongoose');

// 1. You MUST use 'new mongoose.Schema()'
const ratingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    anime_id: { type: Number, required: true, index: true },
    status: String,
    score: { type: Number, index: true },
    is_rewatching: Boolean,
    num_watched_episodes: Number,
}, {
    collection: 'ratings'
});

// 2. Now .index() will work because ratingSchema is a proper Schema object
// This speeds up the 124 Million row search
ratingSchema.index({ anime_id: 1, score: -1 });

module.exports = mongoose.model('rating', ratingSchema);