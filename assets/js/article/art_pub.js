$(function () {
  const layer = layui.layer;
  const form = layui.form;

  //   获取分类数据
  const initCate = (res) => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取分类失败！");
        layer.msg("获取分类成功！");
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 调用 form.render() 方法，否则看不到页面的变化
        form.render("select");
      },
    });
  };
  initCate();

  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //   点击上传图片
  $("#btnChooseImage").on("click", () => {
    $("#coverFile").click();
  });

  $("#coverFile").change((e) => {
    const files = e.target.files;
    if (files.length === 0) return layer.msg("请选择文件后再上传！");
    const newImgUrl = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgUrl) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   定义文章发布状态
  let art_state = "已发布";
  $("#btnSave2").click(() => {
    art_state = "草稿";
  });

  $("#form_pub").on("submit", function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault();
    // console.log(art_status);
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    let fd = new FormData($(this)[0]);
    // 3. 将文章的发布状态，存到 fd 中
    fd.append("state", art_state);
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // 6. 发起 ajax 数据请求
        publishArticle(fd);
      });
  });

  // 发布文章 功能
  const publishArticle = (fd) => {
    $.ajax({
      type: "POST",
      url: "/my/article/add",
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        // 发布文章成功后，跳转到文章列表页面
        location.href = "/article/art_list.html";
        // 发布文章 →跳至 文章列表（在index.js里加一个change类名add和其他类名remove函数）
        window.parent.change();
      },
    });
  };
});
