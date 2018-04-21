const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const SessionStore = require('express-mysql-session')(session)
const logger = require('morgan')
const router = require('./router')
const config = require('./config')

const app = module.exports = express()

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