$(function () {
  getUserInfo();

  // 实现退出按钮功能
  const layer = layui.layer;
  $("#btnLogOut").click(() => {
    layer.confirm("确认是否退出", { icon: 3, title: "" }, function (index) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    });
  });
});

const layer = layui.layer;

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token"),
    // },
    success: (res) => {
      // console.log(res);
      if (res.status !== 0) return layer.msg("获取信息失败");
      layer.msg("获取信息成功");
      renderAvatar(res.data);
    },
    // 在获取用户信息的时候，判断状态是否获取成功
    // complete: (res) => {
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     // 如果获取信息失败，就清空token，且跳转到登录页面
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}

// 渲染头像等信息函数
function renderAvatar(user) {
  // 获取用户名字
  const name = user.nickname || user.username;
  //   将用户名渲染到 欢迎***页面
  $("#welcome").html(`欢迎 ${name}`);
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    const firstName = name[0].toUpperCase();
    $(".text-avatar").html(firstName).show();
  }
}

// 对应art_pub.js里发布文章的跳转列表 调用
function change() {
  $("#art_list").addClass("layui-this").next().removeClass("layui-this");
}
