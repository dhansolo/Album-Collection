var Album = require('./Models/Album.model');
var mongoose = require('mongoose');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendfile('./Public/views/index.html');
    })
    
    app.get('/albums', function(req, res) {
        //console.log('Getting all albums');
        Album.find({})
            .exec(function(err, albums) {
                if(err){
                    res.send('error has occured');
                } else {
                    res.json(albums);
                }
            });
    });

    app.get('/albums/:id', function(req, res) {
        //console.log('Getting one album by ID');
        Album.findOne({
            _id: req.params.id
        })
        .exec(function(err, album) {
                if(err){
                    res.send('error has occured');
                } else {
                    //console.log(album);
                    res.json(album);
                }
        })
    });

    app.post('/album', function(req, res) {
        var newAlbum = new Album();

        newAlbum.title = req.body.title;
        newAlbum.artist= req.body.artist;


        mongoose.model('Album').findOne(
            {
                'title': newAlbum.title,
                'artist': newAlbum.artist
            
            }, 
            function(err, item) {
                //console.log(item);
                if(!item) {
                    //console.log('album does not exist');
                    newAlbum.save(function(err, album) {
                        if(err) {
                            res.send('error saving album: ' + err);
                        } else {
                            //console.log(album);
                            res.send(album);
                        }
                    });
                } else {
                    //console.log('album exists');
                    res.status(500).send('Album Exists');
                }
            });
    });

    app.put('/album/:id', function(req, res) {
        Album.findOneAndUpdate({
            _id: req.params.id}, { $set: {
                title: req.body.title,
                artist: req.body.artist,
                year: req.body.year,
                genre: req.body.genre,
                tracks: req.body.tracks
            }}, 
            {upsert: true},
            function(err, newAlbum) {
                if(err) {
                    console.log('error occured');
                } else {
                    //console.log(newAlbum);
                    res.status(newAlbum);
                }
            });
    });

    app.delete('/album/:id', function(req, res) {
        Album.findOneAndRemove({
            _id: req.params.id
        }, function(err, album) {
            if(err) {
                res.send('error deleting');
            } else {
                //console.log(album);
                res.status(204)
            }
        })
    });
}