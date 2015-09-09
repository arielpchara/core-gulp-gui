
var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var fs = require('fs');
var path = require('path');

var sourcemaps = require('gulp-sourcemaps');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var nwjsify = require('nwjs-browserify');

var nunjucks = require('gulp-nunjucks-html');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var browserSync = require('browser-sync').create();


gulp.task('nw', ["default"], function() {
    var nw = new NwBuilder({
        files: './app/**/**',
        platforms: ['win64'],
        version: '0.12.3',
        winIco: './app/icon.ico'
    });
    // Log stuff you want
    nw.on('log', function(msg) {
        gutil.log('nw-builder', msg);
    });
    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function(err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('sass', function() {
    return gulp.src(['./src/app/scss/*.scss'])
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(gulp.dest('./app/css/'));
});

var jsDest = {
    dir: "./app/js/",
    filename: "main.js"
};

gulp.task("js", function() {

    var b = browserify({
        entries: './src/app/js/main.js',
        debug: true,
        transform: [nwjsify]
      });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        // .pipe( uglify() )
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDest.dir));

    // return gulp.src(['./src/app/js/**/*.js'])
    //     .on('error', gutil.log)
    //     .pipe(gulp.dest(jsDest.dir));
});

var nunjucksOpts = {
  searchPaths: ['src/app/templates'],
  tags: {
    variableStart: '{{{',
    variableEnd: '}}}'
  }
};

gulp.task('nunjucks', function() {
  return gulp.src('src/app/templates/*.html')
    .on('error', gutil.log)
    .pipe(data(function(file) {
      return {
          ngTemplates:fs.readdirSync('src/app/templates/ng-templates').map(function (filename) {
              return filename; // path.join('ng-templates',filename);
          })
      };
    }))
    .pipe(frontMatter())
    .pipe(nunjucks(nunjucksOpts).on('error', gutil.log))
    .pipe(gulp.dest('./app'));
});


var mainTasks = ['sass', 'js', 'nunjucks'];

gulp.task('watch', mainTasks, function() {
    gulp.watch(["./src/app/scss/**/*.scss"], ["sass"]);
    gulp.watch(["./src/app/js/**/*.js"], ["js"]);
    gulp.watch(["./src/app/templates/**/*.html"], ["nunjucks"]);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(["./app/*.html", "./app/css/*.css", "./app/js/*.js"]).on('change', browserSync.reload);
});

gulp.task("default", mainTasks);
