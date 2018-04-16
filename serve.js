
const logger = require('koa-logger')
const router = require('koa-router')()
const koaBody = require('koa-body')
const views = require('koa-views')
const path = require('path')

// setup views mapping .html
// to the swig template engine

const render = views(path.join(__dirname, './page'), {
  map: { html: 'ejs' }
})

const Koa = require('koa');
const app = module.exports = new Koa()

// "database"

const posts = []

// middleware

app.use(logger())

app.use(render)

app.use(koaBody())

// route definitions

router.get('/', async ctx => {
  await ctx.render('index', {})
})
  // .get('/post/new', add)
  // .get('/post/:id', show)
  // .post('/post', create)

app.use(router.routes())


if (!module.parent) app.listen(3001, () => {
	console.log(3001)
})
