$(function () {
    $('#Logout').click(function (e) {
        $.get('/api/user/logout')
        location.href = '/login'
    })
})