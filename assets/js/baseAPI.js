// 在发起ajax请求之前会先调用ajaxPrefilter函数
$.ajaxPrefilter(function (options) {
    // 在发起ajax请求之前同意拼接url字符串
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})