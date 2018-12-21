import client from "../../modules/ApiClient";
import {
    MessageBox
} from 'mint-ui';

$(function () {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=' + encodeURIComponent(window.location.href);
        return;
    }
    client.Request({
        type: "post",
        data: {
            email: $("#email").val(),
            uid: $("#uid").val(),
            code: $("#code").val()
        },
        url: "/my/bindingemail",
        success: function (result) {
            if (result.err_code == "0000")
                location.href = "/mybusiness/basicinformation?bm=True";
            else if (result.err_code == "2010") {
                MessageBox.confirm('当前登录账户与绑定邮箱账户不一致是否切换账户？').then(action => {
                    client.logout();
                    location.href = '/passport/login?returnurl=' + encodeURIComponent(window.location.href);
                }).catch(e => {
                    location.href = "/mybusiness/basicinformation?bm=False";
                });
            } else {
                location.href = "/mybusiness/basicinformation?bm=False";
            }
        }
    })
})