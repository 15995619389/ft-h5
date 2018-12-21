import Vue from "vue";
import * as api from "../../modules/ApiClient";
import {
    Indicator
} from 'mint-ui';

var vm = new Vue({
    el: ".mui-content",
    data: {
        formData: {
            Mobile: '',
            Code: '',
            Mark: 'SendEmail_Fwd_H5',
            afs_scene: '',
            afs_token: '',
            csessionid: '',
            sig: '',
            token: '',
            scene: ''
        },
        SendBtnText: '获取验证码',
        Sec: 60,
        IsSubmit: false,
        ErrorMsg: '',
    },
    created: function () {

    },
    methods: {
        SendValCode: function () {
            this.RefreshData();
            var data = this.$data;
            if (data.IsSubmit) return; //频繁提交
            if (data.formData.Mobile == "") {
                this.SetError("请输入手机号码.");
                return;
            }
            if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(data.formData.Mobile))) {
                this.SetError("手机号码有误，请重新输入.");
                return;
            }
            if (data.formData.csessionid == "") {
                this.SetError("请先通过滑动验证.");
                return;
            }
            this.IsSubmit = true;

            this.SetError("正在获取验证码...");

            var self = this;
            self._setTime();
            api.Request({
                type: 'post',
                url:'/passport/sendmobilecode',
                data: data.formData,
                success: function (d) {
                    if (d && d.Flag) {
                        self.SetError("验证码已发送。");
                        return;
                    }
                    self.refurbishValidate();
                    self.SetError(d.Message);
                    self.IsSubmit = false;
                    self.Sec = 0;

                },
                error: function (d) {
                    self.SetError(d.Message);
                    self.refurbishValidate();
                },
            });
        },
        refurbishValidate: function () {
            var self = this;
            $("#hkdiv").show();
            //var nc = new noCaptcha();
            var nc_appkey = 'FFFF0000000001687A53'; //
            var nc_scene = 'findpwd_h5'; //
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

                    $("#hkdiv").hide();
                    self.ErrorMsg = "验证通过";
                },
                error: function (s) {},
                verifycallback: function (data) {
                    if (data.code == "200") {}
                }
            };
            NoCaptcha.init(nc_option);
            NoCaptcha.setEnabled(true);
        },
        SetError: function (msg) {
            this.$data.ErrorMsg = msg;
        },
        GetInputValue: function (ef) {
            return $(ef).val();
        },
        RefreshData: function () {
            this.$data.formData.afs_scene = this.GetInputValue("#afs_scene");
            this.$data.formData.afs_token = this.GetInputValue("#afs_token");

            this.$data.formData.csessionid = this.GetInputValue("#csessionid");
            this.$data.formData.sig = this.GetInputValue("#sig");
            this.$data.formData.token = this.GetInputValue("#token");
            this.$data.formData.scene = this.GetInputValue("#scene");

        },
        Next: function () {
            this.RefreshData();
            var self = this;
            var data = this.$data;

            if (data.formData.Mobile == "") {
                this.SetError("请输入手机号码.");
                return;
            }
            if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(data.formData.Mobile))) {
                this.SetError("手机号码有误，请重新输入.");
                return;
            }
            if (data.formData.csessionid == "") {
                this.SetError("请先通过滑动验证.");
                return;
            }
            if (data.formData.Code == "") {
                this.SetError("请先输入短信验证码.");
                return;
            }

            data.ErrorMsg = '';
            $.ajax({
                type: 'post',
                url: '/passport/VerMobileVerCode',
                data: data.formData,
                success: function (d) {
                    if (d && d.Flag) {
                        location.href = '/passport/setnewpwd';
                        return;
                    }
                    self.refurbishValidate();
                    data.ErrorMsg = d.Message;
                    data.IsSubmit = false;
                    data.Sec = 0;

                },
                error: function (d) {
                    data.ErrorMsg = d.Message;
                    self.refurbishValidate();
                },
            });

        },
        _setTime: function () { //倒计时
            var data = this.$data;
            data.SendBtnText = '60s可重新发送';
            var setTimeInv = window.setInterval($.proxy(function () {
                if (this.Sec <= 0) {
                    window.clearInterval(setTimeInv);
                    data.Sec = 60;
                    data.SendBtnText = '获取验证码';
                    data.IsSubmit = false;
                    return;
                }
                data.Sec -= 1;
                data.SendBtnText = data.Sec + 's可重新发送';
            }, this), 1000);
        },
    }
});

vm.refurbishValidate();