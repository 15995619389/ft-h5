import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import Vue from "vue";

var localdata = StorageService.Get("i_login");
var My = new Vue({
    el: '.mui-content',
    data: {
        user: localdata || {},
        Dcount: 0,
        Bcount: 0,
        Mcount: 0,
        FBcount: 0,
        RMcount: 0
    },
    created:function(){
        if(!client.IsLogin()){
            location.href = '/passport/login?returnurl=%2Fmybusiness%2Findex/';
            return;
        }
        var data = this.$data;
        client.Request({
            type: "post",
            url: client.Api.myindex,
            success: function (result) {
                data.user = result.user;
                data.Dcount = result.Dcount;
                data.Bcount = result.Bcount;
                data.Mcount = result.Mcount;
                data.FBcount = result.FBcount;
                data.RMcount = result.RMcount;
            },
            complete: function (XMLHttpRequest, textStatus) {}
        });
        $(document).on("click",".mui-collapse>a",function(){
            if($(this.parentElement).hasClass("mui-active")){
                $(this.parentElement).removeClass("mui-active");
            }else{
                $(this.parentElement).addClass("mui-active");
            }
        });
    },
    methods: {
        logout: function () {
            client.logout();
            location.href = '/passport/login?returnurl=%2Fmybusiness%2Findex/';
        }
    }
});