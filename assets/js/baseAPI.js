// 在发起ajax请求之前会先调用ajaxPrefilter函数
$.ajaxPrefilter(function (options) {
    // 在发起ajax请求之前同意拼接url字符串
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 为有权限的请求统一设置headers请求头

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete 函数
    options.complete = function (res) {
        // complete函数中可以通过 res.responseJSON 获取服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空localStorage的 token值
            localStorage.removeItem('token');
            //返回登录页面
            location.href = '/login.html';
        }
    }
})