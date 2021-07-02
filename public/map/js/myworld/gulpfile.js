var
  gulp = require('gulp'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  pump = require('pump');

gulp.task('default', function() {

  console.log('Use combine/compress commands');

});

gulp.task('combine', function () {

  gulp.src('./src/myworld.source.js')
    .pipe(browserify({
    }))
    .pipe(rename('myworld.js'))
    .pipe(gulp.dest('./build/'));

});

gulp.task('compress', function () {

  pump([
    gulp.src('./build/myworld.js'),
    uglify(),
    gulp.dest('./build/')
  ]);

});