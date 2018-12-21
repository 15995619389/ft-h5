import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import {  Toast,Indicator } from 'mint-ui'
import preview from "../../components/img-preview.vue";

var vm = new Vue({
    el: '#container',
    components: {
        preview
    },
    data: {
        Merchant:{articlecount:0,allordercount:0,paymentcount:0,noshipmentcount:0,shipmentcount:0,consultcount:0},
        PanelState:0,
        CompanyInfo:{othercertificate:[]},
        ContactInfo:{},
        OpenInfo:{}
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        this.Init();
    },
    methods: {
        Init:function(){
            var self=this;
            client.Request({
                url:'/highs/merchantindexshow',
                type:'GET',
                success:function(res){
                    if(res.Code=="200"){
                        self.$data.Merchant=res.Data
                        if(self.$data.Merchant.merchantlogo==""){
                            self.$data.Merchant.merchantlogo="/Content/image/high/merchantlogo.png"
                        }
                    }else{
                        location.href="/seller/settled"
                    }
                }
            })
        },
        ChangePanelState:function(status){
            var self=this
            this.$data.PanelState=status
            if(status==1||status==2||status==3){
                client.Request({
                    url:'/highs/merchantinfodetail/'+status,
                    type:'GET',
                    async:false,
                    success:function(res){
                        if(res.Code=="200"){
                            if(status==1){
                                self.$data.CompanyInfo=res.Data
                            }
                            else if(status==2){
                                self.$data.ContactInfo=res.Data
                            }
                            else if(status==3){
                                self.$data.OpenInfo=res.Data
                            }
                        }else{
                            location.href="/seller/settled"
                        }
                    },
                    complete: function () {
                    }
                })
            }
        },
        ShowPreview: function(imgurl) {
            if(imgurl){
                this.$refs.preview.Show(imgurl);
            }else{
                Toast({ message:"没有上传图片", duration: 2000 })
            }
        }
    }
});