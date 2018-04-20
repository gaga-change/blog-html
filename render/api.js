const axios = require('axios')

const dir = 'http://localhost:8081'
exports.userInfo = () => axios.get(dir + '/api/user/session').then(res => res.data)