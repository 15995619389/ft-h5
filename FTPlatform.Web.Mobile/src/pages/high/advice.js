import Vue from "vue";
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import { Toast,Indicator,MessageBox } from "mint-ui";

var vm = new Vue({
    el:"#container",
    components: {
        scroller: scroller.Scroller
    },
    data:{
        param:{type:1,pageIndex:0},
        advices:[],
        replyModel:{id:0,replyNub:""},
        offerModel:{id:0,productid:0,offerprice:"",productname:"",productimg:"",createtime:""},
        isSub:true,
        type:"list"
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
    },
    methods:{
        Get:function(fn){
            var self = this;
            client.Request({
                url:'/highs/consultationlist',
                type:'get',
                data:self.$data.param,
                success:function(result){
                    if(result&&result.err_code == "0000"){
                        if(typeof fn == "function"){
                            fn(result);
                        }else{
                            self.$data.advices = result.data;
                        }
                    }
                },
                complete: function () {
                }
            });
        },
        Refresh:function(bone){
            if(bone){
                Indicator.open('加载中...')
            }
            var self = this;
            self.$data.param.pageIndex = 1;
            setTimeout(function(){
                self.Get();
                if(bone){
                    Indicator.close()
                }
            },500);
            if(bone){
                bone(false);
            }
        },
        Append:function(bone){
            var self  = this;
            var data = self.$data;
           
            data.param.pageIndex++;
            setTimeout(function(){
                self.Get(function(result){
                    var ismore = true;
                    for (var i = 0; i < result.data.length; i++) {
                        data.advices.push(result.data[i]);
                    }

                    if (result.data && result.data.length > 0)
                        ismore = false;
                    bone(ismore);
                })
            },500);         
        },
        ReplyHide:function(){
            $("#mask").hide()
            $("#Reply").hide()
        },
        ProductSkip:function(productId){
            window.location.href="/higharticle/"+productId
        },
        CheckReply:function(content){
            $("#mask").show()
            $("#Reply").show()
            this.$data.replyModel.replyNub=content
        },
        OfferShow:function(index){
            this.type='offer'
            var adviceModel= this.advices[index]
            this.offerModel={
                id:adviceModel.id,
                productid:adviceModel.productid,
                offerprice:adviceModel.offerprice,
                productname:adviceModel.productname,
                productimg:adviceModel.productimg,
                createtime:adviceModel.createtime
            }
        },
        OfferHide:function(){
            this.type='list'
        },
        EnterOrderSkip:function(offerModel){
            window.location.href="/higharticle/orderenter/"+offerModel.productid+"?bid="+offerModel.id
        }
    }
})