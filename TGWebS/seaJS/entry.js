// 所有模块都通过 define 来定义
define(function (require, exports, module) {

    //// 通过 require 引入依赖
    //var $ = require('jquery');
    //var Spinning = require('./spinning');

    ////// 通过 exports 对外提供接口
    ////exports.doSomething = ...

    //// 或者通过 module.exports 提供整个接口
    //module.exports = ...

    //// 异步加载多个模块，在加载完成时，执行回调
    //require.async(['./angular'], function (anuglar) {
       
        //var a = require('./angular');
        var route = require('./angular-route');

        var app = angular.module("app", ['ngRoute']);

        //console.log(app);

    //});
    console.log("haode");

});