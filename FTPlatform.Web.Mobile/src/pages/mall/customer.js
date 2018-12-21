import * as client from "../../modules/ApiClient";
import Vue from "vue";
import { Toast } from 'mint-ui';
import imageUploader from "../../components/image-uploader/image-uploader.vue";

var code = $("#code").val();
var  vm=new Vue({
    el: ".mui-content",
    components: {
        imageUploader,
    },
    data:{
        IsSub:true,
    },
    mounted:function(){
        this.$refs.cusUpLoad.Init({
            CallBack: function (result) {
                if (result) {
                    var html = "<div id=\"\" class=\"img-block\" style=\"float:left;margin-left:2%\">";
                    html += "<img src=\"" + result + "\" class=\"ImgUpDown\" />";
                    html += "<span onclick=\"ImgRemove(this)\">x</span>"
                    html += "</div>";
                    $("#imgAll").prepend(html);
                }
            },
            Action: "/mall/uploadimage"
        });
      
    },
    methods:{
        ImgUplod:function(){
            if ($("#imgAll>div").length >= 4) {
                Toast({ message: '最多上传三张凭证!', position: 'middle', duration: 2000 });
                return;
            }
            layer.closeAll();//关闭提示
            this.$refs.cusUpLoad.Show();
        },
        SubCancel:function(){
            var _seft=this;
            if (_seft.IsSub) {
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
                _seft.IsSub = false;
                client.Request({
                    type: "post",
                    data: { orderCode: code, applyType: applyType, cause: cause, cencalImg: cencalImg },
                    url: client.Api.applycencal,
                    success: function (result) {
                        if (result.Flag) {
                            layer.msg(result.Message, { time: 400000, shade: 0.3, btn: ["知道了"], skin: 'layui-layer-rim' }, function () {
                                location.href = "/mall/orderfromindex";
                            });
                        } else {
                            layer.msg(result.Message);
                            _seft.IsSub = true;
                        }
                    },
                    complete: function () {
                       
                    }
                });
            }
        }
    },
    created:function(){
        var ImgUpHtml = " <div class=\"load-box\" id=\"ImgUp\" v-on:click=\"ImgUplod\" style=\"float:left;margin-left:2%\">";
        ImgUpHtml += " \<img src=\"/Content/image/shop/up.png\" id=\"textfield\">";
        ImgUpHtml += "<input type=\"text\" class=\"field\" style=\"display: none;\" />";
        ImgUpHtml += "<p id='tip'>上传凭证<br>最多3张</p></div>";
        $("#imgAll").html(ImgUpHtml);
    },
});
$(".goods-btn a").click(function () {
    $(".goods-btn a").removeClass("PitchA");
    $(this).addClass("PitchA");
});
