 var app = angular.module("myApp", []);


 app.factory('UserInfoService', ['$http', '$q', function($http, $q) {
     return {
         query: function() {
             var defer = $q.defer(); //声明延后执行
             $http({
                 method: 'GET',
                 url: 'data/students.json'
             }).
             success(function(data, status, headers, config) {
                 defer.resolve(data); //声明执行成功
                 console.log('UserInfoService success');
             }).
             error(function(data, status, headers, config) {
                 defer.reject(); //声明执行失败
             });

             return defer.promise; //返回承诺，返回获取数据的API
         }
     }
 }]);


 app.controller("mainCtrl", ["$scope", 'UserInfoService', function($scope, UserInfoService) {
     // body...


     $scope.name = "tgor1";
     $scope.age = 12;
     $scope.say = function() {
         $scope.age = $scope.age + 20;
     };

     $scope.ask = function() {
         var promise = UserInfoService.query(); //同步调用，获取承诺接口
         promise.then(function(data) {
             $scope.user = data; //调用承诺接口resolove()
             console.log('MainCtrl ...');
         }, function(data) {
             $scope.user = [];
         });

     };

 }]);
