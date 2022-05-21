$(function () {
  const form = layui.form;
  const layer = layui.layer;
  form.verify({
    nickname: (val) => {
      if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
    },
  });

  //   get调取用户信息，渲染至修改页面
  const initUserinfo = () => {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: (res) => {
        console.log(res);
        if (res.status !== 0) return layer.msg("获取数据失败！");
        layer.msg("获取数据成功！");
        form.val("initUserinfo", res.data);
      },
    });
  };

  initUserinfo();

  //   点击重置按钮，重新调用渲染修改页面函数
  $("#btnReset").click((e) => {
    e.preventDefault();
    initUserinfo();
  });

  //   点击提交修改，发起post提交信息请求
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg("更新用户信息失败！");
        layer.msg("更新用户信息成功！");
        window.parent.getUserInfo();
      },
    });
  });
});
