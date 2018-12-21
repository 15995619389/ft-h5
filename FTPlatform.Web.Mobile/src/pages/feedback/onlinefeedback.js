import * as client from "../../modules/ApiClient";
import {Toast} from "mint-ui";

$("#submit").on("click",submit);
if (! client.IsLogin()) {
    location.href = "/passport/login?returnurl=%2Ffeedback%2Fonlinefeedback";
}
$(".description span").click(function () {
    $(this).addClass("text_color").siblings().removeClass("text_color");

})
function IsNull(data) {
    return data == undefined || data == null || data + "" == "" || ("" + data).replace(/(^\s*)|(\s*$)/g, "") == "";
}
function submit() {
    var postData = {
        FeedType: $(".text_color").attr("value"),
        Describe: $("#Describe").val(),
    };
    if (IsNull(postData.FeedType)){
        Toast({message:"问题类型不能为空！",duration:1000});
        return false;
    }
    if (IsNull(postData.Describe)) {
        Toast({message:"问题描述不能为空！",duration:1000});
        return false;
    }
     client.Request({
        type: "post",
        data: postData,
        url: "/feed/submitBack",
        success: function (result) {
            if (result.Flag) {
                $('#mask').css({
                    display: 'block',
                    //height: window.screen.height
                })
                var $Popup = $('.popup');
                $Popup.css({
                    //left: ($('body').width() - $Popup.width()) / 2 + 'px',
                    //top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
                    display: 'block'
                })
            }
            else
                Toast({message:result.Message,duration:1000});
        }
    })
}
$('.disappear').click(function () {
    //Safari返回上一页，页面刷新
    //if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
    //    window.location.href = window.document.referrer;
    //}
    //else { window.history.go("-1"); }
    window.location.href = "/feedback/myfeedback"
})
$('.confirm').click(function () {
    $('#mask,.popup').css('display', 'none');
    $(".description span").removeClass("text_color");
    $("#Describe").val("");
});