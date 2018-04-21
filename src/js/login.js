$(function () {
    var username = $('#inputUsername')
    var password = $('#inputPassword')

    $.get('/api/user/session')
    $('#logout').click(function (e) {
        $.get('/api/user/logout')
    })
    $('#login').click(function (e) {
        e.preventDefault()
        if (!username.val() || !password.val()) {
            $('#errorMessage').text('请输入用户名或密码！')
            $('.alert').show()
            return
        } else {
            $.post('/api/user/login', {
                usernameOrEmail: username.val(), 
                password: password.val(),
                remembe: $('#rememberMe')[0].checked
            }).then(function (res) {
                console.log(res)
                if (res.error) {
                    $('#errorMessage').text(res.error)
                    $('.alert').show()
                } else {
                    location.href = '/dashboard'
                }
                // username.val('')
                // password.val('')
            })
        }

    })
})