var gulp = require('gulp')
var less = require('gulp-less')
var path = require('path')
var LessAutoprefix = require('less-plugin-autoprefix')
var sourcemaps = require('gulp-sourcemaps')
var plumber = require('gulp-plumber');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] })

var dir = {
  less: ['./less/**/*.less'],
  lessMain: ['./less/main.less'],
  output: './css'
}

gulp.task('less', function () {
  return gulp.src(dir.lessMain)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dir.output))
})

gulp.task('watch', ['less'], function() {
  gulp.watch(dir.less, ['less'])
})