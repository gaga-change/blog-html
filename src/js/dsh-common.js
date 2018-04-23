$(function () {
    // 退出登入
    $('#Logout').click(function (e) {
        $.get('/api/user/logout')
        location.href = '/login'
    })
})