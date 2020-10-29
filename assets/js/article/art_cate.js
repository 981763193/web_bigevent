$(function () {
    var form = layui.form;
    var layer = layui.layer;
    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    // 未添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })

    //通过事件代理的方式为form-add添加submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！')
                }
                initArtCateList();
                layer.msg('添加分类成功！');
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的方法给编辑按钮 btn-edit添加点击事件
    var indexEdit
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的方法给编辑按钮 form-edit添加submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章类别失败！')
                }
                layer.msg('修改文章类别成功！');
                initArtCateList();
                layer.close(indexEdit);
            }
        })
    })

    // 通过代理的方法给删除按钮 btn-delete添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 弹出询问提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章类别失败！')
                    }
                    layer.msg('删除文章类别成功！');
                    initArtCateList();
                }
            })

            layer.close(index);
        });

    })
})