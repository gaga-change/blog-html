const express = require('express')
const api = require('./api')
const seo = require('./seo')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
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
router.get('/dashboard', async (req, res) => {
    let ret = await api.userInfo(req.headers)
    if (ret.data) {
        res.render('dashboard', {
            head: seo.dashboard
        })
    } else {
        res.redirect('/login')
    }
})

module.exports = router