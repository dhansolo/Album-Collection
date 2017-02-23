var albumModule = angular.module('albumModule', []);

albumModule.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.formData = {};
    $scope.show = false;

    // GET ALL ALBUMS
    $http.get('/albums')
        .then(function(success) {
            $scope.albums = success.data;
            //console.log(success.data);
            //console.log($scope);
        }, function(error) {
            console.log('Error: ' + error.data);
        });

    // ADD A NEW ALBUM AND RE-GET ALBUMS TO UPDATE THE VIEW
    $scope.newAlbum = function() {
        $http.post('/album', $scope.formData)
            .then(function(success) {
                $scope.formData = {};
                $scope.albums = success.data;
                console.log(success.data);
                $('#albumModal').modal('hide');
            }, function(error) {
                console.log('Error: ' + error.data);
                $scope.formData = {};
                $scope.show = true;
            })
        $http.get('/albums')
            .then(function(success) {
                $scope.albums = success.data;
            }, function(error) {
                console.log('Error: ' + error.data);
            });
    }

    // UPDATE AN ALBUM'S DETAIL AND RE-GET ALBUMS TO UPDATE THE VIEW
    $scope.updateAlbum = function() {
        $http.put('/album/:id', $scope.formData)

        $http.get('/albums')
            .then(function(success) {
                $scope.albums = success.data;
            }, function(error) {
                console.log('Error: ' + error.data);
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
