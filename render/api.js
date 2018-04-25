const axios = require('axios')
const config = require('./config')

const dir = config.BLOG_MY_HOST // api请求地址

/** 获取当前登入用户信息 */
exports.userInfo = (req) => {
    return axios({
        methods: 'get',
        url: dir + '/api/user/session',
        headers: req.headers
    }).then(res => res.data)
}
/** 所有文章 */
exports.articles = (req, params) => {
    return axios({
        methods: 'post',
        url: dir + '/api/article',
        headers: req.headers
    }).then(res => res.data)
}