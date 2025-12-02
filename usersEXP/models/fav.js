const mongoose = require('mongoose');

const favSchema = mongoose.Schema({

    username: String,
    fav_type : String,
    id: Number

}, {collection: 'favs'
});

module.exports = mongoose.model('fav', favSchema);