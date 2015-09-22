var MySalute = require("./m1");
require("../../../js/angular/angular");
require("../../../js/angular/angular-cookies");
require("../../../js/angular/angular-route");

var app = angular.module("app", ['ngCookies', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/user', {
        template: '<p>naocao</p>',
        //controller: 'userController'
    })
    .when('/company', {
        templateUrl: 'company.html',
        //controller: 'companyController'
    });
}]);

app.controller("ctrl", function ($scope) {
    $scope.name = "tg";
});

document.write(MySalute + "world!");
