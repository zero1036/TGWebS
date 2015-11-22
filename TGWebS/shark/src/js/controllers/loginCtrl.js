var controllers = require("../controllers/controllers");

require("../services/loginService");

controllers.controller('loginCtrl', ['$scope', '$$login', function($scope, $$login) {
    //用户
    $scope.user = {
        name: "",
        pwd: ""
    };

    //登录
    $scope.login = function() {
        $$login.login($scope.user, "#/demo");
    };
}]);
