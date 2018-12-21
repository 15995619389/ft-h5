import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl } from '../../modules/UrlService'
import {  Toast,MessageBox } from 'mint-ui'

var vm = new Vue({
    el: '#container',
    data: {
        consulting:{},
        isSub:true
    },
    created: function () {
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if(!GetIdFromUrl()){
            window.location.href = '/higharticlelist'
            return
        }
        var user=client.GetCurrentUser()
        if(user){
            this.$data.consulting.UserName=user.RealName
            this.$data.consulting.UserPhone=user.Mobile
        }
        this.$data.consulting.ProductId=GetIdFromUrl()
    },
    methods: {
        consultPost:function(){
            var _self=this
            if(_self.isSub&&this.validate()){
                _self.isSub=false
                client.Request({
                    type: 'POST',
                    url:"/highs/consultsubmit",
                    data:_self.$data.consulting,
                    success: function (res) {
                        Toast({ message:res.Message, duration: 2000 })
                        if(res.Code=="200"){
                            setTimeout(function () {
                                window.location.href = '/higharticle/'+GetIdFromUrl()
                            },1500)
                        }
                    }, 
                    complete: function () {
                        _self.isSub=true
                    }
                })  
            }
        },
        validate:function(){
            var isPas = true;
            var model=this.$data.consulting
            var reg = new RegExp("^[0-9]*$");
            if(!model.UserName){isPas=false; Toast({ message:"联系人必填", duration: 1000 }) }
            else if(model.UserName.length>50){isPas=false; Toast({ message:"联系人不能大于50字", duration: 1000 }) }
            else if(!model.UserPhone){isPas=false; Toast({ message:"联系方式必填", duration: 1000 }) }
            else if(model.UserPhone.length>50){isPas=false; Toast({ message:"联系方式不能大于50字", duration: 1000 }) }
            else if(!reg.test(model.UserPhone)){isPas=false; Toast({ message:"联系方式格式不正确", duration: 1000 }) }
            else if(!model.PurchaseCount){isPas=false; Toast({ message:"计划购买数量必填", duration: 1000 }) }
            else if (!(/^[0-9]*[1-9][0-9]*$/.test(model.PurchaseCount))) { isPas = false; Toast({ message:"请输入正确的购买数量", duration: 1000 }) }
            else if(!model.ContentNub){isPas=false; Toast({ message:"咨询内容必填", duration: 1000 }) }

            return isPas;
        }
    }
})