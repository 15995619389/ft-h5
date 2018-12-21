import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast} from "mint-ui";
import {Indicator} from "mint-ui";

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
var Supplier =  new Vue({
            el: '.mui-content',
            data: {
                ScientificContent: "",
                PersonExplain: ""
            },
            created: function () {
                this.initData();
            },
            methods: {
                Submit:  function () {
                    if (! client.IsLogin()) {
                        location.href = $.loginReturn(location.href);
                        return;
                    }
                    var self=this;
                    if (self.IsNull($('#content').val()))
                    {
                        Toast({message:"不能为空",duration:1500});
                        return;
                    }
                     client.Request({
                        type: "post",
                        data: { type: $('#type').val(), content: $('#content').val() },
                        url:  client.Api.updatesupplier,
                        success: function (result) {
                            if (result.Flag)
                                location.href = '/expert/supplierdetail';
                            else                               
                            Toast({message:result.Message,duration:1500});
                        },
                        error: function (result) {
                            Toast({message:result.Message,duration:1500});
                        }
                    })
                },
                initData: function () {
                    if (! client.IsLogin()) {
                        location.href = $.loginReturn(location.href);
                        return;
                    }
                    var data = this.$data;
                    Indicator.open({text: '加载中',});
                     client.Request({
                        type: "post",
                        url:  client.Api.supplierdetail,
                        success: function (result) {
                            data.ScientificContent = result.ScientificContent;
                            data.PersonExplain = result.PersonExplain;       
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            Indicator.close();
                        }
                    })
                },
   
                IsNull:function (data) {
                    return data == undefined || data == null || data + "" == "" || ("" + data).replace(/(^\s*)|(\s*$)/g, "") == "";
                }
            }
        })
$(function () {
    if (! client.IsLogin())
    {
        location.href = '/passport/login?returnurl=' + window.location.href;
        return;
    }   
    var user = client.GetCurrentUser();
    if(user.UserType==2)
    {
        if ($("header").find("h1").html() == "个人简介")
            $("header").find("h1").html("机构简介");
    }

})