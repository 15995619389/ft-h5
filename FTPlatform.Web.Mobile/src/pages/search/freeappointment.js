import Vue from "vue";
import * as client from "../../modules/ApiClient";
import { Toast,Indicator } from "mint-ui";

var vm = new Vue({
    el: ".mui-content",
    data: {
        model: {},
        IsSubmit: true,
        SendBtnText: '获取验证码',
        Sec: 60
    },
    methods: {
        reservation: function () {
            var _self = this;
            if (!_self.validate()||!_self.$data.IsSubmit) return;

            _self.$data.IsSubmit = false;
            Indicator.open('提交中,请稍等...');
            client.Request({
                type: "post",
                url: "/search/freereservation",
                data: _self.$data.model,
                success: function (result) {
                    Toast({message:result.Message,duration:1000});
                    if (result.StausCode == "200") {
                        setTimeout(function () {
                            _self.closeReservation();
                        }, 2000);
                    }
                },
                complete: function() {
                    _self.$data.IsSubmit = true;
                    Indicator.close();
                }
            });
        },
        closeReservation: function () {
            window.location.href = "/";
        },
        sendValCode: function () {
            var self = this;
            if (!self.$data.model.phoneNum) {
                Toast({message:"请输入手机号码",duration:1000});
                return; 
            }
            if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(self.$data.model.phoneNum))) {  
                Toast({message:"手机号码格式有误",duration:1000});
                return; 
            }
            if (!self.$data.IsSubmit) return; //频繁提交

            self.$data.IsSubmit = false;
            Indicator.open('验证码已发送至您的手机');

            self.setTime();
            var obj = {
                Mobile: self.$data.model.phoneNum,
                Mark: "freeAppoint",
            }
            client.Request({
                type: 'post',
                url: "/passport/sendmobilecode",
                data: obj,
                success: function (d) {
                    if (!d.Flag) {
                        Toast({message:d.Message,duration:1000});
                    }
                },
                error: function (d) {
                    if (!d.Flag) {
                        Toast({message:d.Message,duration:1000});
                    }
                },
                complete: function() {
                    self.$data.IsSubmit = true;
                    Indicator.close();
                }
            });
        },
        setTime: function () {//倒计时
            var data = this.$data;
            data.SendBtnText = '60s可重新发送';
            var setTimeInv = window.setInterval($.proxy(function () {
                if (this.Sec <= 0) {
                    window.clearInterval(setTimeInv);
                    data.Sec = 60;
                    data.SendBtnText = '获取验证码';
                    data.IsSubmit = true;
                    return;
                }
                data.Sec -= 1;
                data.SendBtnText = data.Sec + 's可重新发送';
            }, this), 1000);
        },
        validate: function () {
            var model = this.$data.model;
            var isPas = true;
            var r = /^\+?[1-9][0-9]*$/;
            if (!model.title) { isPas = false; Toast({message:"请填写需求标题",duration:1000}); }
            else if (model.title.length > 200) { isPas = false;Toast({message:"需求标题不能大于200个字",duration:1000}); }
            else if (!model.businessClassName) { isPas = false;Toast({message:"请填写所属领域",duration:1000}); }
            else if (model.businessClassName.length > 100) { isPas = false;Toast({message:"所属领域不能大于100个字",duration:1000}); }
            else if (!model.content) { isPas = false;Toast({message:"请输入您的具体需求描述",duration:1000});}
            else if (model.content.length > 2000) { isPas = false;Toast({message:"需求描述不能大于2000个字",duration:1000});}
            else if (!model.targetAmount) { isPas = false;Toast({message:"请输入投入预算",duration:1000});}
            else if (!r.test(model.targetAmount)) { isPas = false;Toast({message:"投入预算只能输入整数",duration:1000});}
            else if (model.realName && model.realName.length > 50) { isPas = false;Toast({message:"称呼不能大于50个字",duration:1000});}
            else if (!model.phoneNum) { isPas = false;Toast({message:"请输入手机号码",duration:1000});}
            else if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(model.phoneNum))) { isPas = false;Toast({message:"手机号码格式有误",duration:1000});}
            else if (!model.valCode) { isPas = false;Toast({message:"请输入验证码",duration:1000});}

            return isPas;
        }
    }

});