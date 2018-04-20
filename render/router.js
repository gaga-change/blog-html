const express = require('express')
const api = require('./api')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', async (req, res) => {
    let data = await api.userInfo(req.headers)
    res.render('login', {data})
})

module.exports = router