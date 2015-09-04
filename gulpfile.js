var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('gulp-browserify');
var async = require('async');
var browserSync = require('browser-sync').create();


gulp.task('nw', function () {
    var nw = new NwBuilder({
        files: './app/**/**',
        platforms: ['win64'],
        version:'0.12.3',
        winIco: './app/icon.ico'
    });
    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });
    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('sass',function () {
  return gulp.src(['./src/app/scss/*.scss'])
    .pipe( sass() )
    .on('error',gutil.log)
    .pipe( gulp.dest('./app/css/'));
});

var jsDest = {dir:"./app/js/",filename:"main.js"};

// gulp.task("js-concat",function () {
//   return gulp.src(['./src/app/js/main.js','./src/app/js/**/*.js','!./src/app/js/vendor/**/*.js'])
//     .pipe( concat(jsDest.filename) )
//     .on('error',gutil.log)
//     .pipe( gulp.dest(jsDest.dir));
// });

gulp.task("js", function() {
    // Single entry point to browserify
    gulp.src(['./src/app/js/main.js'])
      .pipe( sourcemaps.init() )
      .pipe( browserify({
        insertGlobals : true
      }))
      .pipe( rename({
        suffix:".bundle"
      }))
      // .pipe( uglify() )
      .on('error',gutil.log)
      .pipe( sourcemaps.write() )
      .pipe(gulp.dest( jsDest.dir ));
});

// gulp.task('js',["browserify"],function () {
//   return gulp.src(['./app/js/main.bundle.js'])
//     .pipe( sourcemaps.init() )
//     .pipe( rename({
//       suffix:".min"
//     }) )
//     .pipe( uglify() )
//     .on('error',gutil.log)
//     .pipe( sourcemaps.write() )
//     .pipe( gulp.dest('./app/js/'));
// });

var mainTasks = ['sass','js'];

gulp.task('w',mainTasks,function () {
  gulp.watch(["./src/app/scss/**/*.scss"],["sass"]);
  gulp.watch(["./src/app/js/**/*.js"],["js"]);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(["./app/*.html","./app/css/*.css","./app/js/*.js"]).on('change', browserSync.reload);
});

gulp.task("default",mainTasks);
