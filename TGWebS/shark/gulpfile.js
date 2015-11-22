//Gulp基础框架
var gulp = require('gulp');
//Gulp基础工具
var gutil = require("gulp-util");
//Webpack模块化打包工具
var webpack = require("webpack");
//webpack配置
var webpackConfig = require("./webpack.config.js");

//webpack模块化打包任务
gulp.task("webpack", function (callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
      // configuration
      myConfig
    , function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

//default mode
gulp.task('default', function () {
    gulp.start('webpack');
});

//Release mode
gulp.task('Release', function () {
    gulp.start('webpack');
});

//Debug mode
gulp.task('Debug', function () {
});



