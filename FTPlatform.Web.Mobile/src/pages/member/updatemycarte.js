import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast} from "mint-ui";

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
var MyCarte = new Vue({
    el: '.mui-content',
    data: {
        carte: [],
        BusCate: []
    },
    created:function(){
        this.initData();
    },
    methods: {
        initData: function () {
            if (!client.IsLogin())
            {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fupdatemycarte';
                return;
            }
            var user = client.GetCurrentUser();
            var data = this.$data;
           
            client.Request({
                type: "post",
                url: client.Api.mycarte + '?id=' + user.Id,
                success: function (result) {
                    data.carte = result;
                    data.BusCate = result.BusCategory;
                },
                complete: function (XMLHttpRequest, textStatus) {
                
                }
            })
        },
        Submit: function () {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fupdatemycarte';
                return;
            }
            var user = client.GetCurrentUser();
            var postdata = {
                Signature: $('#Signature').val(),
                BusinessScope: $('#BusinessScope').val()
            }
            client.Request({
                type: "post",
                data: postdata,
                url: client.Api.updatemycarte,
                success: function (result) {
                    if (result.Flag)
                        window.history.go(-1);
                    else                    
                    Toast({message:result.Message,duration:1000})
                }
            })
        }
    }
})