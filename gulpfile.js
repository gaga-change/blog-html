var gulp = require('gulp')
var less = require('gulp-less')
const path = require('path')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const ossSync = require('gulp-oss-sync')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')
const gulpRename = require('gulp-rename')
const rename = require('rename')
const cleanCss = require('gulp-clean-css')
const lessChanged = require('gulp-less-changed')
const clean = require('gulp-clean')

const OutputPath = 'dist'
const MinifiedExtension = '.min.css'

gulp.task('clean', function () {
  return gulp.src(OutputPath, { read: false }).pipe(clean());
})

/**
 * Less 样式转换 css
 */
gulp.task('css', () => {
  return gulp.src('src/less/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(lessChanged({
      getOutputFileName: file => rename(file, { dirname: OutputPath + '/css', extname: MinifiedExtension })
    }))
    .pipe(less())
    // .pipe(cleanCss())
    .pipe(gulpRename({ extname: MinifiedExtension }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(OutputPath + '/css'))
})

gulp.task('watch', ['clean', 'css'], () => {
  return gulp.watch('src/less/*.less', ['css'])
})

gulp.task('browser-sync', function () {
  browserSync.init(null, {
    proxy: "http://localhost:3001", // 注意这里要换成你在koa中设定的 服务端口一般是3000
    files: ["dist/**/*.*"],
    browser: "chrome",
    port: 7000,
  })
})

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

