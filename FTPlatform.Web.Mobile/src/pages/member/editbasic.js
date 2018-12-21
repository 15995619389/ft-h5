import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import {Toast} from "mint-ui";

function IsNull(data) {
    return data == undefined || data == null || data + "" == "" || ("" + data).replace(/(^\s*)|(\s*$)/g, "") == "";
}
$("#save").on("click", save);

function save() {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=' + UrlService.GetEncodedUrl();
        return;
    }
    var content = $('#rn').val();
    if ($('#type').val() == 2) {
        if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(content))) {
            Toast({message:"手机号有误",duration:1000});
            return;
        }
    }
    if (IsNull(content))
        Toast({message:"请输入修改内容",duration:1000});
    else
        client.Request({
            type: "post",
            data: {
                type: $('#type').val(),
                content: content
            },
            url: client.Api.updateinfo,
            success: function (result) {
                if (result.Flag) {
                    StorageService.Set("i_login", result.DataSource);
                    location.href = '/mybusiness/basicinformation'
                }
            },
            complete: function (XMLHttpRequest, textStatus) {}
        });
}