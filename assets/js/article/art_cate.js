$(function () {
  const layer = layui.layer;
  // 渲染数据函数
  const initArticleList = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取数据失败！");
        layer.msg("获取数据成功！");
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  };
  initArticleList();

  const form = layui.form;
  let indexAdd = null;
  //   点击添加类型按钮事件
  $("#btnAddCate").on("click", () => {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  //   添加分类并渲染
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg("添加类别失败！");
        initArticleList();
        layer.msg("添加类别成功！");
        layer.close(indexAdd);
      },
    });
  });

  // 通过代理方式，为 btn-edit 按钮绑定点击事件
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    // 弹出修改文章分类的弹窗
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + $(this).attr("data-id"),
      success: (res) => {
        console.log(res.data);
        if (res.status !== 0) return layer.msg("获取文章分类失败！");
        layer.msg("获取文章分类成功！");
        form.val("form-edit", res.data);
      },
    });
  });

  // 更新文章分类
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg("更新列表失败！" + res.message);
        layer.msg("更新列表成功！");
        layer.close(indexEdit);
        initArticleList();
      },
    });
  });

  // 删除文章
  $("tbody").on("click", ".btn-delete", function () {
    const id = $(this).attr("data-id");
    // console.log(id);
    // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: (res) => {
          console.log(res.status);
          if (res.status !== 0) return layer.msg("删除文章失败！");
          layer.msg("删除文章成功！");
          initArticleList();
        },
      });
    });
  });
});
