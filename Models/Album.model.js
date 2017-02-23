var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
    title: String,
    artist: String,
    year: Number,
    genre: String,
    tracks: Number,

}, {
    versionKey: false
});

module.exports = mongoose.model('Album', AlbumSchema);