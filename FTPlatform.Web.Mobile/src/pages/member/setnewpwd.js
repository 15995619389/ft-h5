import * as client from "../../modules/ApiClient";
import {Toast} from "mint-ui";

$("#submit").on("click",submit);
function submit() {
    if (! client.IsLogin()) {
        location.href = '/passport/login?returnurl=%2Fpassport%2Fsetnewpwd';
        return;
    }
    var user = client.GetCurrentUser();
    if ($('#OldPwd').val() == "") {
        Toast({message:"请输入当前密码",duration:1000});
        return;
    }
    if ($('#NewPwd').val() == "") {
        Toast({message:"请输入新密码",duration:1000});
        return;
    }
    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test($('#NewPwd').val()))) {
        Toast({message:"密码由英文字母和数字组成，至少6位.",duration:1000}); 
        return;
    }
    if ($('#ConfirmPwd').val() == "") {
        Toast({message:"请确认密码",duration:1000});
        return;
    }
    if ($('#NewPwd').val() != $('#ConfirmPwd').val()) {
        Toast({message:"两次输入密码不一致",duration:1000});
        return;
    }
    if ($('#OldPwd').val() == $('#NewPwd').val()) {
        Toast({message:" 新密码不能和原密码相同",duration:1000});
        return;
    }
     client.Request({
        type: "post",
        data: { Id: user.Id, OldPwd: $('#OldPwd').val(), NewPwd: $('#NewPwd').val() },
        url:  client.Api.setnewpwd,
        success: function (result) {
            if (result.Flag)
                location.href = '/mybusiness/updatepwdsucess';
            else
                Toast({message:result.Message,duration:1000});
        }
    })

}
$(function () {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl='+window.location.href;
        return;
    }
})