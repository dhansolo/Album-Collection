/*

THINGS TO DO:
- TEST APP

OPTIONAL COOL/GOOD THINGS TO DO:
- ADD FEATURE TO UPDATE ALBUM DETAILS 
- ADD PLAY OVERLAY TO ALBUM ART ON HOVER
- HAVE ALBUM BUTTON BE HIGHLIGHTED ON LOAD IF ALBUM IS SELECTED

*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var Album = require('./App/Models/Album.model');
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

require('./App/routes')(app);

app.listen(port, function() {
   console.log("app listening on port " + port);
});

module.exports = app;