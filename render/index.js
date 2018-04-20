
const path = require('path')
const express = require('express')
const logger = require('morgan')
const router = require('./router')
const serve = require('../serve')
const app = express()
const distPath = path.resolve(__dirname, '../', process.env.BUILD_PATH || 'dist')


app.use(logger('dev'))
// 静态资源
app.use('/static', express.static(distPath))
// ejs模板引擎设定
app.set('views', path.resolve(distPath, './html'))
app.engine('.html', require('ejs').__express)
app.set('view engine', 'html')
// 页面路由配置
app.use(router)
app.use(serve)
const port = process.env.PORT || 3002
app.listen(port, () => console.log(port))