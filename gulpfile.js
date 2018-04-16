var gulp = require('gulp')
var less = require('gulp-less')
var path = require('path')
// var LessAutoprefix = require('less-plugin-autoprefix')
var sourcemaps = require('gulp-sourcemaps')
var plumber = require('gulp-plumber')
// var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] })
var ossSync = require('gulp-oss-sync')
var browserSync = require('browser-sync')
var nodemon = require('gulp-nodemon')

var dir = {
  bootstrap: ['./less/bootstrap/**/*.less'],
  bootstrapMain: ['./less/bootstrap/base.less'],
  less: ['./less/*.less'],
  lessMain: ['./less/main.less', './less/dashboard.less'],
  output: './dist'
}

gulp.task('bootstrap', function () {
  return gulp.src(dir.bootstrapMain)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
      // plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dir.output + '/css'))
})

gulp.task('less', function () {
  return gulp.src(dir.lessMain)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
      // plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dir.output + '/css'))
})

gulp.task('watchBootstrap', ['bootstrap'], function () {
  gulp.watch(dir.bootstrap, ['less'])
})

gulp.task('watch', ['bootstrap', 'less'], function () {
  gulp.watch(dir.less, ['less'])
})

gulp.task('browser-sync', function () {
  browserSync.init(null, {
    proxy: "http://localhost:3001", // 注意这里要换成你在koa中设定的 服务端口一般是3000
    files: ["dist/**/*.*"],
    browser: "chrome",
    port: 7000,
  })
})

// gulp.task('start', function () {
//   nodemon({
//     script: 'server.js',
//     env: { 'NODE_ENV': 'development' }
//   })
// })

/** 上传静态资源至阿里云oss */
gulp.task('oss', function (cb) {
  if (!process.env.AccessKeySecret) {
    console.error('process.env.AccessKeySecret 未配置')
    return
  }
  const ossConf = {
    connect: {
      "region": "oss-cn-shenzhen",
      "accessKeyId": "LTAIJPwJ5jMBsElV",
      "accessKeySecret": process.env.AccessKeySecret,
      "bucket": "gagachange"
    },
    controls: {
      "headers": {
        "Cache-Control": "no-cache"
      }
    },
    setting: {
      dir: "css", // root directory name 
      noClean: false, // compare with the last cache file to decide if the file deletion is need 
      force: false, // ignore cache file and force re-upload all the files 
      quiet: true // quiet option for oss deleteMulti operation 
    }
  }
  const cacheConf = {
    cacheFileName: '.oss-cache-test' // the filename for the cache file 
  }
  return gulp.src([dir.output + '/**/*.css', dir.output + '/**/*.map'])
    .pipe(ossSync(ossConf, cacheConf));
})

