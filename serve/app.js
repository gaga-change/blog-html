
const logger = require('koa-logger')
const router = require('koa-router')()
const serve = require('koa-static')
const mount = require('koa-mount')
const koaBody = require('koa-body')
const views = require('koa-views')
const path = require('path')

const distPath = path.resolve(__dirname, '../', process.env.BUILD_PATH || 'dist')

const render = views(path.resolve(distPath, './html'), {
  map: { html: 'ejs' }
})

const Koa = require('koa');
const app = module.exports = new Koa()

// "database"

const posts = []

// middleware

app.use(logger())

app.use(mount('/static', serve(distPath)))
// app.use(mount('/js', serve(path.join(__dirname, '/js'))));

app.use(render)

app.use(koaBody())

// route definitions

router.get('/', async ctx => {
  await ctx.render('index', {})
}).get('/comment', async ctx => {
  await ctx.render('comment')
})
  // .get('/post/new', add)
  // .get('/post/:id', show)
  // .post('/post', create)

app.use(router.routes())

const port = process.env.PORT || 3002
app.listen(port, () => {
	console.log(port)
})
