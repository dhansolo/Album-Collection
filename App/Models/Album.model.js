var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
    title: String,
    artist: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Album', AlbumSchema);