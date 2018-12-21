import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {
    Toast,
    Popup
} from "mint-ui";
Vue.component(Popup.name, Popup);

Vue.filter("email", function (val) {
    return val.length > 15 ? val.substring(0, 15) + ".." : val;
});
Vue.filter('convertCates', function (str) {
    if (str != null && str != "" & str != undefined) {
        var strCate = "";
        var strjson = JSON.parse(str);

        for (var i = 0; i < strjson.length; i++) {
            var item = strjson[i];
            var cate = item.third && item.third.id ? item.third : item.second && item.second.id ? item.second : item.first;
            if (cate.id)
                strCate += cate.name + "/";
        }
        return strCate.substring(0, strCate.length - 1);
    } else {
        return "";
    }
});
$(document).on("change", '#fileField', function () {
    vm.$data.popupVisible = true;
});
var vm = new Vue({
    el: '.mui-content',
    data: {
        user: StorageService.Get("i_login") || {},
        status: "",
        tap: 0,
        popupVisible:false,
        NewCategory:""
    },
    created: function () {
        if (!client.IsLogin()) {
            location.href = '/passport/login?returnurl=' + window.location.href;
            return;
        }
        this.initData();
    },
    mounted() {
        var isbm = $("#BMSucc").val();
        if (isbm == "True") {
            Toast({
                message: "恭喜你，邮箱绑定成功！",
                duration: 1000
            });
        }
        if (isbm == "False")
            Toast({
                message: "邮箱验证失败，请重新验证",
                duration: 1000
            });
    },
    methods: {
        HidePopup:function(){
            console.log(1);
            this.popupVisible = false;
        },
        ApplySupplier: function () {
            var data = this.$data;
            if (data.user.IsValidate != 1) {
                Toast({
                    message: "补充完以上必填项后才可以发布需求或申请供方",
                    duration: 1000
                });
                return;
            }
            location.href = '/expert/applysupplier/';

        },
        editusername: function (username) {
            location.href = '/mybusiness/editusername?content=' + username;
        },
        updateinfo: function (type, content) {
            if (content == null || content == "undefined")
                content = "";
            location.href = '/mybusiness/editbasic?type=' + type + '&content=' + content;
        },
        bindemail: function (str) {
            location.href = '/mybusiness/bindemail?email=' + str;
        },
        initData: function () {
            var data = this.$data;
            var self=this;
            client.Request({
                type: "post",
                url: client.Api.basicInfo,
                success: function (result) {
                    data.user = result.user;
                    $(data.user.FTBusinessNewCategory).each(function(i,o){
                        data.NewCategory+=!self.IsNull(o.BusinessClassLevelName3)?o.BusinessClassLevelName3:(!self.IsNull(o.BusinessClassLevelName2)?o.BusinessClassLevelName2:o.BusinessClassLevelName1)
                        if(i!=data.user.FTBusinessNewCategory.length-1){
                            data.NewCategory+='/'
                        }
                    });

                    data.status = result.status;
                    data.tap = result.tap;
                    StorageService.Set("i_login", result.user);

                },
                complete: function (XMLHttpRequest, textStatus) {}
            });
        },
        UpSupplier: function () {
            location.href = '/expert/upsupplier';
        },
        IsNull:function(str){
            if(str!=null&&str!=""){
                return false
            }else{
                return true
            }
        }
    },

});