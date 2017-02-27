var albumModule = angular.module('albumModule', []);

albumModule.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    $scope.name = "David"
    $scope.show = false;
    $scope.art = false;
    $scope.showAlbums = false;
    $scope.preview;
    $scope.spotifyURL;
    $scope.artistID;
    $scope.spotifyYear;
    $scope.spotifyLabel;
    $scope.spotifyTracks;
    $scope.selected;
    var audio;
    var firstID;
    var isPlaying = false;


    /* -------------------- RESTful API -------------------- */

    // GET ALL ALBUMS
    $scope.getAlbums = function() {
        $http.get('/albums')
            .then(function(success) {
                $scope.albums = success.data;
                if($scope.albums.length > 0) {
                    $scope.showAlbums = true;
                    var randNum = Math.floor(Math.random() * ($scope.albums.length -1));
                    firstID = success.data[randNum]._id;
                    $scope.getAlbum(firstID);
                } else {
                    $scope.showAlbums = false;
                    $scope.art = false;
                    $('#albumArt').removeClass('stopped');
                    audio.pause();
                }
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    $scope.getAlbums();

    // GET A ALBUM
    $scope.getAlbum = function(id) {
        $http.get('/albums/' + id) 
            .then(function(success) {
                $scope.album = success.data;
                $scope.getSpotifyAlbum($scope.album.title, $scope.album.artist);
                $scope.selected = $scope.album._id;
                $('#albumArt').removeClass('playing');
                $('#albumArt').addClass('stopped');
                isPlaying = false;
                audio.pause(); //Will throw error in console because audio is not yet loaded on initial load
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    // ADD A NEW ALBUM AND REFRESH ALBUMS TO UPDATE THE VIEW
    $scope.newAlbum = function() {
        $http.post('/album', $scope.formData)
            .then(function(success) {
                $scope.formData = {};
                $scope.albums = success.data;
                $('#newAlbumModal').modal('hide');
                $scope.getAlbums();
            }, function(error) {
                console.log('Error: ' + error.data);
                $scope.formData = {};
                $scope.show = true;
                setTimeout(function () {
                    $scope.$apply(function() {
                        $scope.show = false;
                    });
                }, 5000);
            })
    }

    // UPDATE AN ALBUM'S DETAIL AND REFRESH ALBUMS TO UPDATE THE VIEW (STILL WORKING)
    $scope.updateAlbum = function(id) {
        console.log(id);
        $http.put('/album/' + id, $scope.formData)
            .then(function(success) {
                $scope.albums = success.data;
                $('#updateAlbumModal').modal('hide');
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    // DELETE AN ALBUM AND REFRESH
    $scope.deleteAlbum = function(id) {
        $scope.data = id;
        if(confirm("Are you sure you want to delete the selected album?")) {
            $http.delete('/album/' + id)
                .then(function(success) {
                    $scope.albums = success.data;
                }, function(error) {
                    console.log('Error: ' + error.data);
                });
            $('#deleteAlbumModal').modal('hide');
            $scope.getAlbums();
        }
    };

    /* -------------------- SPOTIFY INTEGRATION -------------------- */

    //GET ALBUM DETAILS FROM SPOTIFY
    $scope.getSpotifyAlbum = function(title, artist) {
        $http.get('https://api.spotify.com/v1/search?q=' + title + '+' + artist + '&type=album&limit=1')
            .then(function(success) {
                $scope.art = true;
                $scope.spotifyURL = success.data.albums.items[0].external_urls.spotify;
                $('#albumArt').attr("src", success.data.albums.items[0].images[0].url);
                $http.get('https://api.spotify.com/v1/albums/' + success.data.albums.items[0].id)
                    .then(function(success) {
                        var randNum = Math.floor(Math.random() * 10);
                        $scope.preview = success.data.tracks.items[randNum].preview_url;
                        $scope.artistID = success.data.artists[0].id;
                        $scope.spotifyYear = success.data.release_date;
                        $scope.spotifyLabel = success.data.label;
                        $scope.spotifyTracks = success.data.tracks.items.length;
                        audio = new Audio($scope.preview);
                    }, function(error) {
                        console.log('Error: ' + error.data);
                    });
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    //PLAY PREVIEW OF ALBUM FROM SPOTIFY
    $scope.togglePreview = function() {
        isPlaying = !isPlaying;
        if(isPlaying) {
            $('#albumArt').addClass('playing');
            $('#albumArt').removeClass('stopped');
            $('#controls').attr('src', 'pics/pause.png');
            audio.play();
        } else {
            $('#albumArt').removeClass('playing');
            $('#albumArt').addClass('stopped');
            $('#controls').attr('src', 'pics/play.png');
            audio.pause();
            audio.currentTime = 0;
        }
        audio.addEventListener('ended', function() {
            $('#albumArt').removeClass('playing');
            $('#albumArt').addClass('stopped');
        });
    }

}]);