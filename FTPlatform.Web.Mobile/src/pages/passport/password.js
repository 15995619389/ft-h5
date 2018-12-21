import Vue from "vue";
import * as api from "../../modules/ApiClient";

var vm = new Vue({
    el:".mui-content",
    data:{
        formData: {
            Pwd: '',
            VerPwd: '',
        },
        IsSubmit: false,
        ErrorMsg: ''
    },
    methods:{
        SubmitChange:function(){
            var data = this;
            if (data.formData.Pwd == "") {
                data.ErrorMsg = "新密码不能为空.";
                return;
            }
    
            if (data.formData.VerPwd == "") {
                data.ErrorMsg = "确认密码不能为空.";
                return;
            }
    
            if (data.formData.Pwd.length < 6 || data.formData.VerPwd.length < 6) {
                data.ErrorMsg = "密码不能少于6位数字字母组合.";
                return;
            }
    
            if (data.formData.Pwd != data.formData.VerPwd) {
                data.ErrorMsg = "两次输入的密码不一致.";
                return;
            }
    
            $.ajax({
                type: 'post',
                url: '/passport/modifypwd',
                data: data.formData,
                success: function (d) {
                    if (d && d.Flag) {
                        data.ErrorMsg = '密码修改成功,正在为您跳转...';
                        setTimeout(function () {
                            location.href = '/passport/login';
                        }, 1000);
                        return;
                    }
                    data.ErrorMsg = d.Message;
                    switch (d.StausCode) {
                        case "1001":
                            location.href = '/passport/findpwd';
                            break;
                        default:
                    }
    
                },
                error: function (d) {
                    data.ErrorMsg = d.Message;
                },
            });
        }
    }
});