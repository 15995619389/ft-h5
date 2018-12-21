
var IsSub = true;
$(function () {
    var code = $("#code").val();
    $(".goods-btn a").click(function () {
        $(".goods-btn a").removeClass("PitchA");
        $(this).addClass("PitchA");
    })

    var ImgUpHtml = " <div class=\"load-box\" id=\"ImgUp\" style=\"float:left;margin-left:2%\">";
    ImgUpHtml += " \<img src=\"/Content/image/shop/up.png\" id=\"textfield\">";
    ImgUpHtml += "<input type=\"text\" class=\"field\" style=\"display: none;\" />";
    ImgUpHtml += "<p id='tip'>上传凭证<br>最多3张</p></div>";
    $("#imgAll").html(ImgUpHtml);

    $("#ImgUp").on("click", function () {
        if ($("#imgAll>div").length >= 4) {
            layer.tips("最多上传三张凭证!", "#tip", { tips: [4, 'red'] });
            return;
        }
        $("#component-imguploader").addClass("show");
    });
    ImageUploader.Init({
        CallBack: function (result) {
            if (result) {
                var html = "<div id=\"\" class=\"img-block\" style=\"float:left;margin-left:2%\">";
                html += "<img src=\"" + result + "\" class=\"ImgUpDown\" />";
                html += "<span onclick=\"imgRem(this)\">x</span>"
                html += "</div>";
                $("#imgAll").prepend(html);
            }
        },
        Action: "/mall/uploadimage"
    });

   
    $("#SubCancel").click(function () {
        if (IsSub) {
            var applyType = $(".goods-btn a[class='PitchA']").attr("applyType");
            var cause = $("#cause").val();
            var divlength = $("#imgAll>div").length;
            if (applyType == "" || applyType == null || applyType == 'undefined ') {
                layer.msg("请选择申请类型！");
                return;
            }
            if (cause == "" || cause == null || cause == 'undefined ') {
                layer.tips("原因不能为空!", "#cause", { tips: [3, 'red'] });
                $("#cause").focus();
                return;
            }
            if (divlength <= 1) {
                layer.tips("至少上传一张凭证!", "#ImgUp", { tips: [4, 'red'] });
                return;
            }
            var cencalImg = [];
            $.each($(".ImgUpDown"), function (i, item) {
                cencalImg.push($(item).attr("src"));
            });
            //IsSub = false;
            $.take({
                type: "post",
                data: { orderCode: code, applyType: applyType, cause: cause, cencalImg: cencalImg },
                url: $.api.applycencal,
                success: function (result) {
                    if (result.Flag) {
                        layer.msg(result.Message, { time: 400000, shade: 0.3, btn: ["知道了"], skin: 'layui-layer-rim' }, function () {
                            location.href = "/mall/orderfromindex";
                        });
                    } else {
                        layer.msg(result.Message);
                    }
                },
                complete: function () {
                    IsSub = true;
                }
            })
        }
    })
})
function imgRem(th) {
    $(th).parent().remove();
}
