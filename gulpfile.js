var gulp = require('gulp')
var less = require('gulp-less')
const path = require('path')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const gulpRename = require('gulp-rename')
const rename = require('rename')
const cleanCss = require('gulp-clean-css')
const lessChanged = require('gulp-less-changed')
const changed = require('gulp-changed')
const clean = require('gulp-clean')
const ugLify = require('gulp-uglify')
// const imageMin = require('gulp-imagemin')
// const pngquant = require('imagemin-pngquant')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const revDel = require('rev-del')
const gulpSequence = require('gulp-sequence')
const notify = require('gulp-notify')

const OutputPath = 'dist'
const MinifiedExtension = '.min.css'

// 清空 idst 目录
gulp.task('clean', function () {
  return gulp.src(['dist/*', '!dist/image'], { read: false }).pipe(clean())
})
// 清空 build&dist 目录
gulp.task('clean-build', function () {
  return gulp.src(['build', 'dist'], { read: false }).pipe(clean())
})
// Less 样式转换 css
gulp.task('css', () => {
  return gulp.src('src/less/*.less')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    // .pipe(lessChanged({
    //   getOutputFileName: file => rename(file, { dirname: OutputPath + '/css', extname: MinifiedExtension })
    // }))
    .pipe(less())
    // .pipe(cleanCss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(OutputPath + '/css'))
})
// watch css
gulp.task('watch-css', ['css'], () => {
  gulp.watch('src/less/**/*.less', ['css'])
})
// watch js
gulp.task('watch-js', ['script'], () => {
  gulp.watch('src/js/**/*.js', ['script'])
})
// javescript 
gulp.task('script', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(changed('dist/js', { hasChanged: changed.compareSha1Digest }))
    .pipe(ugLify())
    .pipe(gulp.dest('dist/js'))
})
// 图片处理
gulp.task('image', function () {
  return gulp.src('./src/image/*.*')
    .pipe(changed('dist/image', { hasChanged: changed.compareSha1Digest }))
    // .pipe(imageMin({
    //   progressive: true,// 无损压缩JPG图片  
    //   svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性  
    //   use: [pngquant()] // 使用pngquant插件进行深度压缩  
    // }))
    .pipe(gulp.dest('dist/image'))
  // .pipe(browserSync.reload({ stream: true }))
})
// 资源目录
gulp.task('lib', () => {
  return gulp.src('src/lib/**/*')
    .pipe(gulp.dest('dist/lib'))
})

gulp.task('html', () => {
  return gulp.src('src/page/**/*.html')
    .pipe(gulp.dest('dist/html'))
})

gulp.task("node", function (cb) {
  const nodemon = require('gulp-nodemon')
  var called = false
  nodemon({
    script: './render/index.js',
    watch: ['serve', 'render'],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', function () {
    if (!called) {
      cb()
      called = true
    }
  })
})

gulp.task('browser-sync', ['node'], function () {
  const browserSync = require('browser-sync')
  browserSync.init(null, {
    proxy: "http://localhost:3002", // 注意这里要换成你在koa中设定的 服务端口一般是3000
    files: ['dist/css/*', 'dist/js/*'],
    notify: false,
    browser: "chrome",
    port: 8081,
  })
})

gulp.task('css-hash', () => {
  return gulp.src('dist/css/*.css')
    .pipe(cleanCss())
    .pipe(rev())
    .pipe(gulp.dest('build/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/rev/css'))
})
gulp.task('js-hash', () => {
  return gulp.src('dist/js/*.js')
    .pipe(rev())
    .pipe(gulp.dest('build/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build/rev/js'))
})
gulp.task('build-maps', () => {
  return gulp.src('dist/css/maps/*.map')
    .pipe(gulp.dest('build/css/maps'))
})
gulp.task('build-image', () => {
  return gulp.src('dist/image/**/*')
    .pipe(gulp.dest('build/image'))
})
gulp.task('build-lib', () => {
  return gulp.src('dist/lib/**/*')
    .pipe(gulp.dest('build/lib'))
})

gulp.task('rev', function () {
  return gulp.src(['build/rev/**/*.json', 'dist/html/**/*.html'])
    .pipe(revCollector({
      replaceReved: true,
    }))
    .pipe(gulp.dest('build/html'))
})

gulp.task('build', ['clean-build'], () => {
  gulpSequence(['css', 'script', 'lib', 'image', 'html'],
    ['css-hash', 'js-hash', 'build-maps', 'build-image', 'build-lib'],
    'rev'
    , (err) => {
      if (err) console.log(err)
    })
})

gulp.task('default', ['clean'], () => {
  gulpSequence(['css', 'script', 'lib', 'image', 'html'], 'browser-sync', () => {
    console.log('------------- -------------')
    gulp.watch('src/less/**/*.less', ['css'])
    gulp.watch('src/js/**/*.js', ['script'])
    gulp.watch('src/iamge/**/*', ['image'])
    gulp.watch('src/lib/**/*', ['lib'])
    gulp.watch('src/page/**/*', ['html'])
  })
})

/** 上传静态资源至阿里云oss */
gulp.task('oss', function (cb) {
  const ossSync = require('gulp-oss-sync')
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
      dir: "test", // root directory name 
      noClean: false, // compare with the last cache file to decide if the file deletion is need 
      force: false, // ignore cache file and force re-upload all the files 
      quiet: true // quiet option for oss deleteMulti operation 
    }
  }
  const cacheConf = {
    cacheFileName: '.oss-cache-test' // the filename for the cache file 
  }
  return gulp.src(['build/**/*', '!build/html/**/*', '!build/rev/**/*'])
    .pipe(ossSync(ossConf, cacheConf))
})

