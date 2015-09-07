var gulp = require('gulp');
var gutil = require("gulp-util");
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var webpack = require("webpack");
var clean = require('gulp-clean');
//var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');    

var webpackConfig = require("./webpack.config.js");
gulp.task("webpack", function(callback) {
  var myConfig = Object.create(webpackConfig);
  // run webpack
  webpack(
    // configuration
    myConfig
  , function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('minjs', ['webpack'], function () {
    return gulp.src(['./content/js/build/*.js'])
       .pipe(jshint())
       .pipe(jshint.reporter('default'))
       .pipe(uglify())
       .pipe(rev())                                           
       .pipe(gulp.dest('./content/js/pub'))
       .pipe(rev.manifest())                                 
       .pipe(gulp.dest('./rev'));                            
});

gulp.task('rev',['minjs'], function () {
    gulp.src(['./rev/*.json', './view/*/*.html'])  
        .pipe(revCollector())                                
        .pipe(gulp.dest('./view'));                       
});

// clean folder
gulp.task('clean', function () {
    return gulp.src(['./content/js/build'], { read: false })
      .pipe(clean());
});

// //debug mode
// gulp.task('debug', ['clean'], function () {
//     gulp.start('minjs');
// });

// //debug
// gulp.task('release', ['clean'], function () {
//     gulp.start('minjs');
// });

//default mode
gulp.task('default', function () {
    gulp.start('minjs');
    gulp.start('rev');
});