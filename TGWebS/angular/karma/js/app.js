 var app = angular.module("myApp", ['ngResource']);


 app.factory('userService', ['$http', '$q', function($http, $q) {
     return {
         query: function() {

             return $http({
                 method: 'GET',
                 url: 'data/students.json'
             });
         }
     }
 }]);

app.directive('aGreatEye', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<h1>lidless, wreathed in flame, {{1 + 1}} times</h1>'
    };
});

 app.controller("mainCtrl", ["$scope", 'userService', function($scope, userService) {
     // body...


     $scope.name = "tgor1";
     $scope.age = 12;
    
     $scope.add = function() {
         $scope.age = $scope.age + 20;
     };


     $scope.user = [];
     $scope.ask = function() {
         userService.query().success(function(data, status, headers, config) {
             $scope.user = data;
         }).
         error(function(data, status, headers, config) {           
         });

         // $scope.user = [{
         //     name: "ab"
         // }];
     };

    
 }]);
