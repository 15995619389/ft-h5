import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast} from "mint-ui";
import {Indicator} from "mint-ui";

Vue.filter("ft", function (val) {
    switch (val) {
        case 1:
            return "注册问题"
            break;
        case 2:
            return "登录密码及寻找问题"
            break;
        case 3:
            return "发布需求问题"
            break;
        case 4:
            return "对接需求问题"
            break;
        case 5:
            return "页面Bug问题"
            break;
        case 6:
            return "功能建议"
            break;
        case 7:
            return "其他"
            break;
        default:
            return "其他";
    }

})
var Detail = new Vue({
            el: '.mui-content',
            data: {
                fd: {},
            },
            created:function(){
                this.initData();
            },
            methods: {
                initData: function () {
                    var data = this.$data;
                    Indicator.open({text: '加载中',});
                    client.Request({
                        type: "post",
                        url:client.Api.feedbackdetail + '?id=' + $('#id').val(),
                        success: function (result) {
                            data.fd = result;
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            Indicator.close();
                        }
                    })
                },
            }
        })