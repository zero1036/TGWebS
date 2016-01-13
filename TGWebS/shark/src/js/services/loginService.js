var services = require("../services/services");

services.factory('$$login', ['$$http', '$$auth', function($$http, $$auth) {
    var service = {};

    //登录
    service.login = function(params, redirectUrl) {
        var result = $$http.doPost("Home", "Login", params);

        result.success(function(data) {
            if (data.ok) {
                //token写入cookies
                $$auth.setToken(data.token);
                //登录重定向
                window.location.href = redirectUrl;
            } else {
                alert("登录失败");
            }
        }).error(function(e) {
            alert("服务异常");
        });
    };

    return service;
}]);
