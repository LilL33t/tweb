const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    gender: String,
    birthday: String,
    location: String,
    joined: String,
    watching: String,
    completed: String,
    on_hold: String,
    dropped: String,
    plan_to_watch: String,
}, {collection: 'profiles'
});

module.exports = mongoose.model('profile', profileSchema);