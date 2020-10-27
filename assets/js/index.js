$(function () {
    // 调用getUserInfo方法获取用户信息
    getUserInfo();
    // 绑定点击事件 退出登录
    var layer = layui.layer;
    $('#logout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 清空localStorage的值
            localStorage.removeItem('token');
            //返回登录页面
            location.href = '/login.html';

            layer.close(index);
        });
    })
})

// 定义一个获取用户信息的方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头的配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户头像和用户名
            renderAvatar(res.data);
        },
        // 不管请求失败还是成功都会调用complete函数
        // complete: function (res) {
        //     // complete函数中可以通过 res.responseJSON 获取服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空localStorage的 token值
        //         localStorage.removeItem('token');
        //         //返回登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

//渲染用户头像和用户名的方法
function renderAvatar(user) {
    // 获取用户名
    var name = user.nickname || user.username;
    // 设置用户名
    $('.welcome').html('欢迎&nbsp&nbsp' + name);

    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show();
    }

}