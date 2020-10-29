$(function () {

    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                form.render();
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

    })

    // 监听文件选择框 coverFile的 change事件
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择图片！')
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的状态
    var art_state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单创建一个FormData对象
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {    // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 调用发表文章的方法 发起ajax请求
                publishArticle(fd);

            })
    })
    // 定义发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器发送到数据是 FormData 格式  则必须添加一下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 文章发布成功后跳转到 文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }

})