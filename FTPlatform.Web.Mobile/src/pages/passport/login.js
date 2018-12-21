import Vue from "vue";
import * as api from "../../modules/ApiClient";
import {
    Indicator
} from 'mint-ui';

var vm = new Vue({
    el: ".mui-content",
    data: {
        form: {
            Mobile: '',
            PassWord: '',
            RememberMe: false,
            afs_scene: '',
            afs_token: '',
            csessionid: '',
            sig: '',
            token: '',
            scene: '',
            __RequestVerificationToken: ""
        },
        ErrorMsg: '',
        IsErrorVisible: false,
        IsHD: false
    },
    created: function () {
        if (api.IsLogin()) {
            window.location.href = '/mybusiness/';
            return;
        }
        $(document).on("click", ".login-btn", this.Login);
        $(document).on("blur", "#Mobile", this.ValidateMobile);
        $(document).on("blur", "#PassWord", this.ValidatePassword);
        //Init ali
        try {
            var nc_appkey = 'FFFF0000000001687A53'; //
            var nc_scene = 'login_h5'; //
            var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
            var nc_option = {
                renderTo: '#dom_id', //渲染到该DOM ID指定的Div位置
                appkey: nc_appkey,
                scene: nc_scene,
                token: nc_token,
                trans: '{"name1":"FFFF0000000001687A53"}', //测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
                callback: function (data) { // 校验成功回调
                    document.getElementById('csessionid').value = data.csessionid;
                    document.getElementById('sig').value = data.sig;
                    document.getElementById('token').value = nc_token;
                    document.getElementById('scene').value = nc_scene;
    
                    $("#ErrorMsg").html("");
                },
                error: function (s) {},
                verifycallback: function (data) {
                    if (data.code == "200") {}
                }
            };
            NoCaptcha.init(nc_option);
            NoCaptcha.setEnabled(true);
    
        } catch (e) {
    
        }
    },
    methods: {
        GetSession: function () {
            this.form.afs_scene = $("#afs_scene").val();
            this.form.afs_token = $("#afs_token").val();
            this.form.csessionid = $("#csessionid").val();
            this.form.sig = $("#sig").val();
            this.form.token = $("#token").val();
            this.form.scene = $("#scene").val();
        },
        ValidateMobile:function(){
            if (this.form.Mobile == "") {
                this.ErrorMsg = "请填写手机号码";
                this.IsErrorVisible = true;
                return false;
            }
            if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.form.Mobile))) {
                this.ErrorMsg = "手机号码有误，请重新输入";
                this.IsErrorVisible = true;
                return false;
            }
            return true;
        },
        ValidatePassword:function(){
            if (this.form.PassWord == "") {
                this.ErrorMsg = "请填写密码";
                this.IsErrorVisible = true;
                return false;
            }
            return true;
        },
        Validate: function () {
            if(!this.ValidateMobile()){
                return false;
            }
            if(!this.ValidatePassword()){
                return false;
            }
            if (!$("#csessionid").val() && self.IsHD) {
                this.ErrorMsg = "请先通过滑动验证";
                this.IsErrorVisible = true;
                return false;
            }
            this.IsErrorVisible = false;
            return true;
        },
        RefurbishValidate:function(){
            var self = this;
            NoCaptcha.reset();
            //var nc_appkey = 'FFFF0000000001687A53';
            //var nc_scene = 'login_h5';
            //var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
            //var nc_option = {
            //    renderTo: '#dom_id',
            //    appkey: nc_appkey,
            //    scene: nc_scene,
            //    token: nc_token,
            //    trans: '{"name1":"FFFF0000000001687A53"}',
            //    callback: function (data) {
            //        document.getElementById('csessionid').value = data.csessionid;
            //        document.getElementById('sig').value = data.sig;
            //        document.getElementById('token').value = nc_token;
            //        document.getElementById('scene').value = nc_scene;
            //        self.IsErrorVisible = false;
            //    }
            //};
            //NoCaptcha.init(nc_option);
            //NoCaptcha.setEnabled(true);
        },
        Login: function () {
            var self = this;
            self.GetSession();
            if (!self.Validate()) {
                return;
            }
            self.form.__RequestVerificationToken = $(":hidden[name='__RequestVerificationToken']").val();
            Indicator.open('正在登录...');
            api.Request({
                type: 'post',
                url: '/passport/login',
                data: self.form,
                success: function (res) {
                    if (res && res.Flag) {
                        api.Storage.Set("i_login", res.DataSource);
                        var returnUrl = api.GetReturnUrl();
                        if (!returnUrl || returnUrl.indexOf('login') >= 0) {
                            window.location.href = '/home/index';
                            return;
                        }
                        window.location = decodeURIComponent(returnUrl);
                        return;
                    }
                    if (res && res.IsRedirect) {
                        $("#huadong").show();
                        self.IsHD = true;
                    }
                    self.ErrorMsg = res.Message;
                    self.IsErrorVisible = true;
                    self.RefurbishValidate();
                },
                error: function (err) {
                    this.ErrorMsg = err.Message;
                    this.IsErrorVisible = true;
                    if (err && err.IsRedirect) {
                        $("#huadong").show();
                        self.IsHD = true;
                    }
                    self.RefurbishValidate();
                },
                complete: function () {
                    Indicator.close();
                }
            });
        }
    }
});