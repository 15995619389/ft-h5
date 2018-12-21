import Vue from "vue";
import scroller from "vue-scroller";
import { GetIdFromUrl,GetParamUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import { Toast,Indicator,MessageBox } from "mint-ui";

var vm = new Vue({
    el:"#container",
    components: {
        scroller: scroller.Scroller
    },
    data:{
        param:{type:2,pageIndex:0},
        consultations:[],
        replyModel:{id:0,replyNub:""},
        isSub:true
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
                            self.$data.consultations = result.data;
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
                        data.consultations.push(result.data[i]);
                    }

                    if (result.data && result.data.length > 0)
                        ismore = false;
                    bone(ismore);
                })
            },500);         
        },
        ProductSkip:function(productId){
            window.location.href="/higharticle/"+productId
        },
        ReplyShow:function(replyId){
            $("#mask").show()
            $("#Immediate").show()
            this.$data.replyModel.id=replyId
            this.$data.replyModel.replyNub=""
        },
        ReplyHide:function(){
            $("#mask").hide()
            $("#Immediate").hide()
            $("#Reply").hide()
        },
        ReplyPost:function(){
            var self=this
            var model=self.$data.replyModel
            if(!model.replyNub){
                Toast({ message:"回复内容不能为空", duration: 1000 })
                return
            }
            if(self.$data.isSub){
                self.$data.isSub=false
                var replyContent=encodeURI(model.replyNub)
                client.Request({
                    url:'/highs/consultreply/'+model.id+"/"+replyContent,
                    type:'POST',
                    success:function(result){
                        Toast({ message:result.err_msg, duration: 1000 })
                    },
                    complete: function () {
                        self.ReplyHide()
                        self.Refresh()
                        self.$data.isSub=true
                    }
                });
            }
        },
        CheckReply:function(content){
            $("#mask").show()
            $("#Reply").show()
            this.$data.replyModel.replyNub=content
        }
    }
})