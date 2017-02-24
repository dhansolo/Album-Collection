/*

THINGS TO DO:
- INTEGRATE SPOTIFY API
- ADD FEATURE TO UPDATE ALBUM DETAILS?
- MORE DETAILED VALIDATION
- SEARCH FEATURE

*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var Album = require('./Models/Album.model');
var port = 8080;
var db = 'mongodb://localhost/albums';

mongoose.connect(db);

app.set('view engine', 'html');
app.use(express.static(__dirname + '/Public'));
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.sendfile('./Public/index.html');
})

app.get('/albums', function(req, res) {
    console.log('Getting all albums');
    Album.find({})
        .exec(function(err, albums) {
            if(err){
                res.send('error has occured');
            } else {
                //console.log(albums);
                res.json(albums);
            }
        });
});

app.get('/albums/:id', function(req, res) {
    console.log('Getting one album by ID');
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
    newAlbum.year = req.body.year;
    newAlbum.genre = req.body.genre;
    newAlbum.tracks = req.body.tracks;


    mongoose.model('Album').findOne(
        {
            'title': newAlbum.title,
            'artist': newAlbum.artist,
            'year': newAlbum.year,
            'genre': newAlbum.genre,
            'tracks' : newAlbum.tracks
        
        }, 
        function(err, item) {
            console.log(item);
            if(!item) {
                console.log('album does not exist');
                newAlbum.save(function(err, album) {
                    if(err) {
                        res.send('error saving album: ' + err);
                    } else {
                        //console.log(album);
                        res.send(album);
                    }
                });
            } else {
                console.log('album exists');
                res.status(500).send('Album Exists');
            }
        });
});

app.put('/album/:id', function(req, res) {
    Album.findOneAndUpdate({
        _id: req.params.id
    }, { $set: {
            title: req.body.title,
            artist: req.body.artist,
            year: req.body.year,
            genre: red.body.genre,
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

app.listen(port, function() {
   console.log("app listening on port " + port);
});

module.exports = app;


/*
app.post('/album2', function(req, res) {
    Album.create(req.body, function(err, album) {
        if(err) {
            res.send('error saving album');
        } else {
            //console.log(album);
            res.send(album);
        }
    });
});
*/