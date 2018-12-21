import * as client from "../../modules/ApiClient";
import Clipboard from "Clipboard";
import {Toast} from "mint-ui";

$("#Copy1").click(function () {
    share(1);
});
$("#Copy0").on("click", function () {
    share(0);
});
$(".share-list .c-tool-btn").click(function () {
    call($(this).attr("id"));
})
$(".share-overlay").on("click", shareHide);
$("#share-cancel").on("click", cancel);
$(".hide").on("click", shareHide);

$('.disappear').click(function () {
    $('#mask,.popup_consult').css('display', 'none');
})

var user = client.GetCurrentUser();
var register = "http://" + window.location.host + "/passport/register/";
if (user) {
    register += user.UserName;
}
var l = window.location.href;
if (l.indexOf("?") != -1)
    l = l.substring(0, l.indexOf("?"));
    
var showtype = -1;
var copy = false;
var val = "";
$('#Copy0').attr("data-clipboard-text", l);
$('#Copy1').attr("data-clipboard-text", register);
var clipboard = new Clipboard('#Copy1');
clipboard.on('success', function (e) {
    copy = true;
});
var clipboard2 = new Clipboard('#Copy0');
clipboard2.on('success', function (e) {
    copy = true;
});
var ua = navigator.userAgent.toLowerCase();

function isWeiXin() {
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

function isbaidu() {
    if (ua.indexOf("baidu") > 0) {
        return true;
    } else {
        return false;
    }
}

function isSafari() {
    if (ua.indexOf("safari") > -1 && ua.indexOf("iphone") > -1) {
        return true;
    } else {
        return false;
    }
}

function showcopy() {
    $('#mask').css({
        display: 'block',
        height: $("html").height()
    })
    var $Popup = $('.popup_consult');
    $Popup.css({
        left: ($('body').width() - $Popup.width()) / 2 + 'px',
        top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
        display: 'block'
    })
    if (showtype == 0)
        $('#CopyModel').val(l);
    else {
        $('#CopyModel').val(register);
    }


}
var nativeShare = new NativeShare()
var shareData = {
    title: '注册邀请',
    desc: '注册飞天众智！！',
    // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
    link: register,
    // 不要过于依赖以下两个回调，很多浏览器是不支持的
    success: function () {
        Toast({
            message: "分享成功",
            duration: 1000
        })
    },
    fail: function () {
        Toast({
            message: "分享失败",
            duration: 1000
        })
    }
}
var login = client.IsLogin();

function share(type) {
    setTimeout(function () {
        showtype = type;
        if (type == 1) {
            if (!login) {
                location.href = '/passport/login?returnurl=' + window.location.href;
                return;
            }
            nativeShare.setShareData(shareData);
        } else {
            nativeShare.setShareData({
                title: document.title,
                desc: '来自飞天众智的' + document.title + '页面',
                // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
                link: window.location.href,
                // 不要过于依赖以下两个回调，很多浏览器是不支持的
                success: function () {
                    Toast({
                        message: "分享成功",
                        duration: 1000
                    })
                },
                fail: function () {
                    Toast({
                        message: "分享失败",
                        duration: 1000
                    })
                }
            });
        }
        if (isbaidu()) {
            call('wechatFriend');
            return;
        }
        if (isWeiXin()) {
            if (type == 0) {
                $(".right-sharing").show();
                $(".share-overlay").show();
            } else {
                if (copy)
                    Toast("链接已复制成功，请粘贴发给你的好友！");
                else {
                    showcopy();
                }
            }
            return;
        }
        if (isSafari()) {
            if (type == 0) {
                $(".share-overlay").show();
                $(".sharing-hint").show();
                return;
            } else {
                if (copy)
                    Toast("链接已复制成功，请粘贴发给你的好友！");
                else
                    showcopy();

                return;
            }
        }
        $(".share-overlay").show();
        $(".share-wrapper").slideDown("show");
    }, 100);

}

function shareHide() {
    $('#share-cancel').click();
    $(".sharing-hint").hide();
    $(".right-sharing").hide();
}

function cancel() {
    $(".share-overlay").hide();
    $(".share-wrapper").slideUp("show");
}

function call(command) {
    if (ua.indexOf('mqqbrowser') > -1 && (command == 'wechatFriend' || command == 'wechatTimeline')) {
        shareHide();
        Toast("链接已复制成功，请粘贴发给你的好友！");
    }
    try {
        nativeShare.call(command);
    } catch (err) {
        shareHide();
        if (showtype == 0) {
            $(".share-overlay").show();
            $(".sharing-hint").show();
        } else if (copy) {
            Toast("链接已复制成功，请粘贴发给你的好友！");
        } else {
            showcopy();
        }
    }
}