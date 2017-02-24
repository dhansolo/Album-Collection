var albumModule = angular.module('albumModule', []);

albumModule.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    $scope.name = "David"
    $scope.show = false;
    $scope.art = false;
    $scope.preview;

    /* -------------------- RESTful API -------------------- */

    // GET ALL ALBUMS
    $scope.getAlbums = function() {
        $http.get('/albums')
            .then(function(success) {
                $scope.albums = success.data;
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    $scope.getAlbums();

    // GET A ALBUM
    $scope.getAlbum = function(id) {
        $http.get('/albums/' + id) 
            .then(function(success) {
                console.log(success.data);
                $scope.album = success.data;
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    // ADD A NEW ALBUM AND RE-GET ALBUMS TO UPDATE THE VIEW
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

    // UPDATE AN ALBUM'S DETAIL AND RE-GET ALBUMS TO UPDATE THE VIEW
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
        $http.get('https://api.spotify.com/v1/search?q=' + title + '+' + artist + '&type=album&limit1')
            .then(function(success) {
                $scope.art = true;
                $('#albumArt').attr("src", success.data.albums.items[0].images[0].url);
                $http.get('https://api.spotify.com/v1/albums/' + success.data.albums.items[0].id)
                    .then(function(success) {
                        $scope.preview = success.data.tracks.items[1].preview_url;
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
        var playing = false;
        if(playing) {
            audio.pause();
            playing = false;
        } else {
            audio.play();
            playing = true;
        };
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
