import * as client from "../../modules/ApiClient";
import Vue from "vue";
Vue.filter('formatDate', function (value) {
    if (value != null && value != "") {
        return value.substring(0, 10);
    }
});
var My = new Vue({
            el: '.mui-content',
            data: {
                user: {},
                company: {}
            },
            created:function(){
                this.initData();
            },
            methods: {
                initData: function () {
                    if (!client.IsLogin())
                    {
                        location.href = '/passport/login?returnurl=%2Fmybusiness%2Fcompanyinfo';
                        return;
                    }
                    var data = this.$data;
                    client.Request({
                        type: "post",
                        url: client.Api.basicInfo,
                        success: function (result) {
                            data.user = result.user;
                            data.company = result.user.UserCompany
                        }, complete: function (XMLHttpRequest, textStatus) {
                        }
                    });
                },
            },
        });