$(function () {
  const layer = layui.layer;
  const form = layui.form;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: "1",
    pagesize: "2",
    cate_id: "",
    state: "",
  };

  //   获取表格数据
  const initTable = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: (res) => {
        console.log(res);
        // 渲染页面
        if (res.status !== 0) return layer.msg("获取文章列表失败！");
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // form.render();
        renderPage(res.total);
      },
    });
  };
  initTable();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 初始化文章分类的方法
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        console.log(res);
        if (res.status !== 0) return layer.msg("获取分类失败！");
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render("select");
      },
    });
  };
  initCate();

  // 筛选功能
  $("#form-search").on("submit", (e) => {
    // 阻止表单默认提交
    e.preventDefault();
    const cate_id = $("[name=cate_id]").val();
    const state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  const laypage = layui.laypage;
  // 定义渲染分页方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 删除功能
  $("tbody").on("click", ".btn-delete", function (e) {
    // 获取文章的id
    const id = $(this).attr("data-id");
    // 询问是否真的要删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
