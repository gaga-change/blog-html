const axios = require('axios')

const dir = 'http://localhost:8081'
// req.headers
exports.userInfo = (headers) => {
    return axios({
        methods: 'get',
        url: dir + '/api/user/session',
        headers: headers
    }).then(res => res.data)
}