import * as client from "../../modules/ApiClient";
import Vue from "vue";

Vue.filter('removeHTMLTag', function (str) {
    if (str != null && str != "" & str != undefined) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/ /ig, '');//去掉
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/\s/g, "");
        return str;
    }
});
$(function () {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=' + window.location.href;
        return;
    }
    var vm = new Vue({
        el: '.mui-content',
        data: {
            expert: {},
        },
        created: function () {
            this.Init();
        },
        methods: {
            Init: function () {
                if (!client.IsLogin()) {
                    location.href = $.loginReturn(location.href);
                    return;
                }
                var _data = this.$data;
               client.Request({
                    type: "post",
                    url: client.Api.supplierdetail,
                    success: function (result) {
                        _data.expert = result;
                    }
                });
            },
            EditPatent: function (id) {
                location.href = '/expert/editpatent/' + id;
            },
            EditSupplier: function (type) {
                location.href = '/expert/editsupplier?type=' + type;
            }
        }
    });
    var user = client.GetCurrentUser();
    if (user.UserType == 2) {
        $('#PersonExplain').find("span").eq(0).html("机构简介");
    }
});
