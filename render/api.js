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