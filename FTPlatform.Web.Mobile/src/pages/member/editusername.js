import * as client from "../../modules/ApiClient";
var IsSubmit = false;
import {Toast} from "mint-ui";

var Sec = 60;
$("#SendValCode").on("click", SendValCode);
$("#Submit").on("click", Submit);

function SendValCode() {
    if (IsSubmit) return; //频繁提交
    if ($('#Password').val() == "") {
        Toast({message:"请输入密码",duration:1000});
        return;
    }
    if ($('#Mobile').val() == "") {
        Toast({message:"请输入手机号码",duration:1000});
        return;
    }
    if ($('#csessionid').val() == "") {
        Toast({message:"请先通过滑动验证.",duration:1000});
        return;
    }
    if (!(/^1(3|4|5|6|7|8)\d{9}$/.test($('#Mobile').val()))) {
        Toast({message:"手机号码有误，请重新输入.",duration:1000});
        return;
    }
    IsSubmit = true;
    Toast({message:"正在获取验证码...",duration:1000});
    var self = this;
    setTime();
    client.Request({
        type: 'post',
        url: client.Api.sendcode,
        data: {
            NewMobile: $('#Mobile').val(),
            Password: $('#Password').val(),
            VerCode: "1111"
        },
        success: function (d) {
            if (d && d.Flag) {
                Toast({message:d.Message,duration:1500});
                return;
            }
            refurbishValidate();
            Toast({message:d.Message,duration:1500});
            IsSubmit = false;
            Sec = 0;
        },
        error: function (d) {
            Toast({message:d.Message,duration:1500});
            refurbishValidate();
        },
    });
}

function setTime() {
    $("#SendValCode").text('60s可重新发送');
    var setTimeInv = window.setInterval($.proxy(function () {
        if (Sec <= 0) {
            window.clearInterval(setTimeInv);
            Sec = 60;
            $("#SendValCode").text('获取验证码');
            IsSubmit = false;
            return;
        }
        Sec -= 1;
        $("#SendValCode").text('' + Sec + 's可重新发送');
    }, this), 1000);
}

function refurbishValidate() {
    var nc_appkey = 'FFFF0000000001687A53'; // 应用标识,不可更改
    var nc_scene = 'register'; //场景,不可更改
    var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
    var nc_option = {
        renderTo: '#dom_id', //渲染到该DOM ID指定的Div位置
        appkey: nc_appkey,
        scene: nc_scene,
        token: nc_token,
        trans: '{"name1":"FFFF0000000001687A53"}', //测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
        callback: function (data) { // 校验成功回调
            //console.log(data.csessionid);
            //console.log(data.sig);
            //console.log(nc_token);

            document.getElementById('csessionid').value = data.csessionid;
            document.getElementById('sig').value = data.sig;
            document.getElementById('token').value = nc_token;
            document.getElementById('scene').value = nc_scene;
        }
    };
    NoCaptcha.init(nc_option);
    NoCaptcha.setEnabled(true);
}

function Submit() {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=' + UrlService.GetEncodedUrl();
        return;
    }
    if ($('#Password').val() == "") {
        Toast({message:"请输入密码",duration:1000});
        return;
    }
    if ($('#Mobile').val() == "") {
        Toast({message:"请输入手机号码",duration:1000});
        return;
    }
    if ($('#csessionid').val() == "") {
        Toast({message:"请先通过滑动验证.",duration:1000});
        return;
    }
    if ($('#Code').val() == "") {
        Toast({message:"请输入验证码",duration:1000});
        return;
    }
    if (!(/^1(3|4|5|6|7|8)\d{9}$/.test($('#Mobile').val()))) {
        Toast({message:"手机号码有误，请重新输入.",duration:1000});
        return;
    }
    client.Request({
        type: "post",
        url: client.Api.editusername,
        data: {
            NewMobile: $('#Mobile').val(),
            Password: $('#Password').val(),
            VerCode: $('#Code').val()
        },
        success: function (result) {
            if (result.Flag) {
                StorageService.Set("i_login", result.DataSource);
                location.href = '/mybusiness/basicinformation';
            } else
                Toast({message:result.Message,duration:1000});
        }
    })
}