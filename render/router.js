const express = require('express')
const api = require('./api')
const seo = require('./seo')
const router = express.Router()

const admin = async (req, res, next) => {
    let ret = await api.userInfo(req)
    if (ret.data) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/', (req, res) => {
    res.render('index', {
        head: seo.home
    })
})
// 登入页
router.get('/login', async (req, res) => {
    let ret = await api.userInfo(req)
    if (ret.data) {
        res.redirect('dashboard')
    } else {
        res.render('login', {
            head: seo.login
        })
    }
})

// 后台管理
router.get('/dashboard', admin, async (req, res) => {
    res.render('dashboard', {
        head: seo.dashboard
    })
})
// 写文章
router.get('/post-new', admin, async (req, res) => {
    res.render('post-new', {
        head: seo.postNew
    })
})
// 所有文章
router.get('/post-all', admin, async (req, res) => {
    let ret = await api.articles(req)
    if (ret.data) {
        res.render('post-all', {
            head: seo.postAll,
            data: ret.data
        })
    } else {
        res.send(ret)
    }
})
// 上传图片测试
router.get('/upload', async (req, res) => {
    res.render('upload')
})

module.exports = router