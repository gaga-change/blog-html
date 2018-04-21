const axios = require('axios')
const config = require('./config')

const dir = config.BLOG_MY_HOST
// req.headers
exports.userInfo = (headers) => {
    return axios({
        methods: 'get',
        url: dir + '/api/user/session',
        headers: headers
    }).then(res => res.data)
}