const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const SessionStore = require('express-mysql-session')(session)
const logger = require('morgan')
const multer = require('multer')
const fs = require('fs')
const router = require('./router')
const config = require('./config')

const app = module.exports = express()
const uploadPath = path.resolve(__dirname, '../uploads/')
// const upload = multer({ dest: uploadPath, limits: 4 * 1024 })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  var upload = multer({ storage: storage })
if (!module.parent) app.use(logger('dev'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
if (!module.parent) app.use(cookieParser())
const options = {
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE
}
// app.use('/img/upload', express.static(uploadPath))
app.use(session({
    secret: '123456',
    name: 'sessionId', // cookie中的键名，用于存储sessionId
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }, // cookie保存的时间
    store: new SessionStore(options),
    resave: false,
    saveUninitialized: false
}))
// api 请求
app.use('/api', router)
app.post('/api/profile', upload.single('avatar'), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    // fs.writeFileSync('test', req.file)
    res.send({})
})
app.post('/api/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files 是 `photos` 文件数组的信息
    // req.body 将具有文本域数据，如果存在的话
    res.send({})
})
// 404 处理
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})
// 异常处理
app.use((err, req, res, next) => {
    if (typeof err !== 'string')
        res.status(err.status || 500)
    res.send({ err: err.message, error: err })
})

const port = process.env.PORT || 3002
if (!module.parent) app.listen(port, () => console.log(port))