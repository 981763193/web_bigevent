$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 给时间补零的函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }

    // 定义格式化时间的过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    initTable();

    initCate();
    // 定义一个查询的参数对象 q，将来请求数据的时候将参数对象提交到服务器
    var q = {
        pagenum: 1,     //页码值
        pagesize: 2,    //每页显示多少条数据
        cate_id: '',    //文章分类的 Id
        state: ''        //文章的状态
    }
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页方法
                rendrPage(res.total);
            }
        })
    }

    // 初始化分类列表
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
                // console.log(htmlStr);
                // 通过layui 重新渲染表单UI结构
                form.render();
            }
        })
    }

    // 为筛选按钮绑定submit 提交表单事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 将获取到的值赋值给查询参数对象 q
        q.cate_id = cate_id;
        q.state = state;

        // 根据新的查询参数对象 q 重新获取文章列表
        initTable();
    })

    // 定义一个渲染分页的方法
    function rendrPage(total) {
        // 调用laypage.render（）方法渲染分页区域
        laypage.render({
            elem: 'pageBox',
            limit: q.pagesize,
            count: total, //数据总数，从服务端得到
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发 jump 回调函数实现分页按钮的切换
            jump: function (obj, first) {
                // 将最新的页码值 赋值给 查询参数对象q
                q.pagenum = obj.curr;
                // 把最新的条目数赋值给 查询参数对象q
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }

            }
        });

    }

    // 通过代理的形式 给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).val('data-id');
        // 弹出询问提示框
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');

                    // 当删除数据成功后要判断当前页面是否还有数据，如果没有需要将页码值 -1
                    // 通过对页码上删除按钮的个数 $('.btn-delete')来确定当前页面文章数量
                    if ($('.btn-delete').length === 1) {
                        // 判断页码值是否大于1
                        q.pagenum = q.pagenum > 1 ? q.pagenum - 1 : 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})