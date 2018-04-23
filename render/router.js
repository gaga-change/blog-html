const express = require('express')
const api = require('./api')
const seo = require('./seo')
const router = express.Router()

const admin = async (req, res, next) => {
    let ret = await api.userInfo(req.headers)
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
    let ret = await api.userInfo(req.headers)
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
// 后台管理
router.get('/post-new', admin, async (req, res) => {
    res.render('post-new', {
        head: seo.postNew
    })
})
module.exports = router