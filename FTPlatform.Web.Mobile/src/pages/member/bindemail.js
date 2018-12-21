import * as client from "../../modules/ApiClient";
import {Toast} from "mint-ui";

$(function () {
    $(".mui-btn-blue").click(function () {
        if (!client.IsLogin())
        {
            location.href = '/passport/login?returnurl='+window.location.href;
            return;
        }
        client.Request({
            type: "post",
            url: client.Api.bindemail + '?email=' + $('#email').val(),
            success: function (result) {
                if (result.Flag) {
                    $('#bind').css("display", "none");
                    $('#success').css("display", "block");
                    $('#ok').css("display", "block");
                }
                else {
                    if (result.Message == "101")
                        window.history.go(-1);
                    else
                    Toast({message:result.Message,duration:1000});
                }
            }
        })


    })
})