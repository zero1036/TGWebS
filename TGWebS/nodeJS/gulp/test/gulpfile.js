var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

gulp.task('mjs', function () {
    return gulp.src(['js/*.js','js/nb/*.js'])
       .pipe(jshint())
       .pipe(jshint.reporter('default'))
       .pipe(uglify())
       //.pipe(concat('app.js'))
       .pipe(gulp.dest('build'));
});

gulp.task('greet', function () {
    console.log('Hello world!');
});

gulp.task('clean', function () {
    return gulp.src(['build'], { read: false })
      .pipe(clean());
});

gulp.task('default', ['clean'], function () {
    gulp.start('mjs', 'greet');
});

gulp.task('watch', function () {

    //// 看守所有.scss档
    //gulp.watch('src/styles/**/*.scss', ['styles']);

    // 看守所有.js档
    //gulp.watch('js/*.js', ['mjs']);

    gulp.watch('js/*.js', function (e) {
        console.log(e);
    });

    //// Create LiveReload server
    //livereload.listen();
    //// Watch any files in assets/, reload on change
    //gulp.watch(['js/*']).on('change', livereload.changed);

    //// 看守所有图片档
    //gulp.watch('src/images/**/*', ['images']);

});