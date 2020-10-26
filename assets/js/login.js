$(function () {
    // 登录注册切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide()
    })

    // 自定义登录密码的预验证
    // 从layui获取对象

    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return "两次输入的密码不一致！"
            }
        }
    });
    // 监听表单注册事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起post请求
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }
        $.post('/api/reguser',
            data,
            function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                }
                // console.log(res.message);
                layer.msg(res.message);
                $('#link_login').click();
            }
        )
    })
    // 监听登录表单提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.post('/api/login',
            data,
            function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg('登录失败！');
                }
                // console.log(res.message);
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将登录后返回的token值保存到localStorage中
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        )
    })
})