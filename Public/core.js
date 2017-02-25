var albumModule = angular.module('albumModule', []);

albumModule.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    $scope.name = "David"
    $scope.show = false;
    $scope.art = false;
    $scope.preview;
    var firstID;
    var isPlaying = false;

    /* -------------------- RESTful API -------------------- */

    // GET ALL ALBUMS
    $scope.getAlbums = function() {
        $http.get('/albums')
            .then(function(success) {
                $scope.albums = success.data;
                var randNum = Math.floor(Math.random() * ($scope.albums.length -1));
                firstID = success.data[randNum]._id;
                $scope.getAlbum(firstID);
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
        $scope.getAlbums();
    }

    // UPDATE AN ALBUM'S DETAIL AND REFRESH ALBUMS TO UPDATE THE VIEW
    $scope.updateAlbum = function() {
        $http.put('/album/:id', $scope.formData)
            .then(function(success) {
                $scope.albums = success.data;
                console.log(success.data);
                $('#updateAlbumModal').modal('hide');
            }, function(error) {
                console.log('Error: ' + error.data);
            });
        $scope.getAlbums();
    }

    // DELETE AN ALBUM AND REFRESH
    $scope.deleteAlbum = function(id) {
        console.log(id);
        $scope.data = id;
        console.log($scope.data);
        if(confirm("Are you sure you want to delete the selected album?")) {
            $http.delete('/album/' + id)
                .then(function(success) {
                    $scope.albums = success.data;
                    console.log(success.data);
                }, function(error) {
                    console.log('Error: ' + error.data);
                });
            $('#deleteAlbumModal').modal('hide');
            $scope.getAlbums();
        }
    };

    /* -------------------- SPOTIFY INTEGRATION -------------------- */

    //GET ALBUM ART FROM SPOTIFY
    $scope.getSpotifyAlbum = function(title, artist) {
        $http.get('https://api.spotify.com/v1/search?q=' + title + '+' + artist + '&type=album&limit=1')
            .then(function(success) {
                $scope.art = true;
                $('#albumArt').attr("src", success.data.albums.items[0].images[0].url);
                $http.get('https://api.spotify.com/v1/albums/' + success.data.albums.items[0].id)
                    .then(function(success) {
                        var randNum = Math.floor(Math.random() * 10) + 1;
                        $scope.preview = success.data.tracks.items[randNum].preview_url;
                    }, function(error) {
                        console.log('Error: ' + error.data);
                    });
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    //PLAY PREVIEW OF ALBUM

    $scope.togglePreview = function() {
        var audio = new Audio($scope.preview);
        $('#albumArt').addClass('playing');
        if($('#albumArt').hasClass('playing')) {
            audio.play();
        }
        audio.addEventListener('ended', function() {
            $('#albumArt').removeClass('playing');
        });
    }

}]);


/* --------------------------------------------------OLD CODE BELOW --------------------------------------------------*/

/*
(function(app) {
    "use strict";
    app.controller('mainController', function($scope, $http) {
        $scope.formData = {};

        //GET ALL ALBUMS WHEN PAGE LOADS AND SHOW THEM
        $http.get('/albums')
            .success(function(data) {
                $scope.albums = data;
                console.log(data);
                console.log($scope);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        
        //ADD A NEW ALBUM TO THE COLLECTION
        $scope.newAlbum = function() {
            $http.post('/album', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.albums = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    });
})(albumModule);*/

/*
function mainController($scope, $http) {
    $scope.formData = {};

    //GET ALL ALBUMS WHEN PAGE LOADS AND SHOW THEM
    $http.get('/albums')
        .success(function(data) {
            $scope.albums = data;
            console.log(data);
            console.log($scope);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    
    //ADD A NEW ALBUM TO THE COLLECTION
    $scope.newAlbum = function() {
        $http.post('/album', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.albums = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}*/
