import * as client from "../../modules/ApiClient";
import Vue from "vue";
import foot from "../../components/mall-nav/mall-nav.vue"
var GetGold=new Vue({
    el:".mui-content",
    components:{
        foot,
    },
    methods: {        
        Publish:function () {
            if (!client.IsLogin()) {
                location.href = 'passport/login?returnurl=%2Fdemand%2Fpublish';
                return;
            }
            client.Request({
                type: "get",
                url: "/user/complete",
                success: function (result) {
                    if (result.data)
                        location.href = '/demand/publish';
                    else {
                        $('#mask').css({
                            display: 'block',
                            height: $("html").height()
                        })
                        $('.mint-popup').css("display", "block");
                    }
                }
            })

        }
    },
})
$(function () {
    $(".ft-tab a").removeClass("mui-active");
    $(".ft-tab a").eq(0).attr("href", "/mall");
    $(".ft-tab a").eq(0).find("span").eq(1).html("商城首页");
    $(".disappear").on("click", function () {
        $(".mint-popup,#mask").css({ "display": "none" });
    });
})
