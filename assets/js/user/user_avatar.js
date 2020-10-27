$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮绑定点击事件
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    // 给文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        console.log(e);
        if (e.target.files.length === 0) {
            return layui.layer.msg('请选择图片！')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 上传头像
    $('#btnUpload').on('click', function () {
        // 获取裁剪之后用户头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')    // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发起ajax请求上传头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('上传头像失败！');
                }
                layui.layer.msg('上传头像成功！');
                window.parent.getUserInfo();
            }
        })
    })
})