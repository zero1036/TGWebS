require("../controllers/controllers");
require("../services/services");
require("../directives/directives");
require("../filters/filters");

//获取app配置
var appConfig = require("!json!./app.config.json");

//获取app
var app = angular.module('cashApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.nd', 'services', 'directives', 'controllers', 'filters']);

//权限级别
app.constant('ACCESS_LEVELS', {
    pub: 1,
    user: 2
});

//cookies keys
app.constant('COOKIES_KEYS', {
    auth: "__RequestVerificationToken",
});

//配置后台服务异常拦截器
app.factory('sessionInjector', ['$rootScope', '$q', function($rootScope, $q) {
    var sessionInjector = {
        'response': function(resp) {
            return resp;
        },
        'responseError': function(rejection) {
            // 服务器错误处理
            switch (rejection.status) {
                case 401:
                    if (rejection.config.url !== 'api/login')
                        $rootScope.$broadcast('auth:loginRequired');
                    break;
                case 403:
                    $rootScope.$broadcast('auth:forbidden');
                    break;
                case 404:
                    $rootScope.$broadcast('page:notFound');
                    break;
                case 418:
                    $rootScope.$broadcast('unAuth');
                    break;
                case 500:
                    $rootScope.$broadcast('server:error');
                    break;
            }
            return $q.reject(rejection);
        }

    };
    return sessionInjector;
}]);

//配置路由
app.config(['$routeProvider', '$httpProvider', '$locationProvider', 'ACCESS_LEVELS', function($routeProvider, $httpProvider, $locationProvider, ACCESS_LEVELS) {
    $routeProvider
        .when('/', {
            templateUrl: 'asset/html/demo.html',
            access_level: ACCESS_LEVELS.user
        })
        .when('/login', {
            templateUrl: 'asset/html/login.html',
            controller: 'loginCtrl',
            access_level: ACCESS_LEVELS.pub
        })
        .when('/demo', {
            templateUrl: 'asset/html/demo.html',
            access_level: ACCESS_LEVELS.user
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    //配置后台服务异常拦截器
    $httpProvider.interceptors.push('sessionInjector');
}]);

//配置路由变更监听
app.run(['$rootScope', '$location', '$$auth', function($rootScope, $location, $$auth) {
    // 给$routeChangeStart设置监听
    $rootScope.$on('$routeChangeStart', function(evt, next, curr) {
        if (!$$auth.isAuthorized(next.$$route.access_level)) {
            window.location.href = '#/login';
        }
    });

    $rootScope.$on('auth:loginRequired', function(evt, next, curr) {
        window.location.href = "#/unauthorized";
    });
}]);

//身份验证服务
app.factory('$$auth', ['$window', '$cookieStore', '$timeout', 'ACCESS_LEVELS', function($window, $cookieStore, $timeout, ACCESS_LEVELS, COOKIES_KEYS) {
    return {
        isAuthorized: function(lvl) {
            if (lvl == ACCESS_LEVELS.pub) {
                return true;
            } else {

                var t = $cookieStore.get(COOKIES_KEYS.auth);
                if (t == undefined) {
                    return false;
                }
            }
        },
        getToken: function() {
            return $cookieStore.get(COOKIES_KEYS.auth);
        },
        setToken: function(val) {
            $cookieStore.put(COOKIES_KEYS.auth, val);
        },
        logout: function() {
            $cookieStore.remove('user');
            _user = null;
        }
    };
}]);

//封装http服务，验证post token
app.factory('$$http', ['$http', function($http) {
    var service = {};

    //获取地址
    function getPostUrl(api, action, url) {
        return "/" + api + "/" + action;
    };

    //post
    service.doPost = function(api, action, param, url) {
        var url = getPostUrl(api, action, url);

        return $http.post(url, param);
    };

    //post token
    service.doPostToken = function(api, action, param, url) {
        var result = {};
        var url = getPostUrl(api, action, url);

        try {
            if (!param) {
                param = {};
            }

            var token = ft.__RequestVerificationToken.value;
            param["__RequestVerificationToken"] = token;

        } catch (e) {}

        //生成参数
        param = urlEncode(param);

        result = $http({
            method: 'POST',
            url: url,
            data: param,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return result;
    };

    //get for url
    service.doGet = function(url, params) {
        return $http({
            method: 'get',
            url: url,
            params: params
        });
    };

    //生成转码
    var urlEncode = function(param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof(param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };


    return service;
}]);

module.exports = app;
