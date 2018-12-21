import Vue from "vue";
import scroller from "vue-scroller";
import { GetParamUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import { Popup,Toast,Indicator,MessageBox } from "mint-ui";

var vm = new Vue({
    el:".container",
    data:{
        order:{
            aftersaletypeval:"",
            aftersalecontent:"",
            orderstatus:0,
            logisticscompany:"",
            logisticsnumber:"",
            buymessage:"",
            InvoiceModel:null,
            CritiqueModel:null
        },
        AppraiseModel:{orderNumber:"",party:1,appraise:"",score:1},
        DeliveryModel:{orderNumber:"",logisticsCompany:"",logisticsNumber:""},
        Type:"orderdetail",
        isSub:true
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if(!GetParamUrl("number")){
            window.location.href = '/seller/order'
            return
        }
        this.$data.order.ordernumber=GetParamUrl("number")
        this.Init()
    },
    methods:{
        Init:function(){
            Indicator.open('加载中...')
            var self=this;
            client.Request({
                url:'/highs/sellerorderdetail/'+self.$data.order.ordernumber,
                type:'GET',
                success:function(res){
                    if(res&&res.err_code == "0000"){
                        self.$data.order=res.data
                    }
                },
                complete: function () {
                    Indicator.close()
                }
            });
        },
        Operation:function(type,orderNumber){
            var self  = this;
            if(!client.IsLogin()){
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            if(!self.$data.isSub){
                return
            }

            if(type=="deliverShow"){//显示发货
                $(".DeliverGoods").show();
                $("#DeliverGoodmask").show();
                self.$data.DeliveryModel.orderNumber=orderNumber
            }
            else if(type=="deliver"){//发货
                if(!self.$data.DeliveryModel.logisticsCompany){
                    Toast({ message:"物流公司不能为空", duration: 2000 })
                    return
                }
                else if(!self.$data.DeliveryModel.logisticsNumber){
                    Toast({ message:"物流单号不能为空", duration: 2000 })
                    return
                }
                self.$data.isSub=false
                client.Request({
                    url:'/highs/delivery',
                    type:'POST',
                    data:self.$data.DeliveryModel,
                    success:function(result){
                        Toast({ message:result.err_msg, duration: 2000 })
                    },
                    complete: function () {
                        self.PanelHide('deliver')
                        self.Init()
                        self.$data.isSub=true
                    }
                });
            }
            else if(type=="appraiseShow"){//显示评价
                self.$data.Type="appraise"
                self.$data.AppraiseModel.orderNumber=orderNumber
            }
            else if(type=="appraisePost"){//提交评价
                var model=self.$data.AppraiseModel

                if(!model.appraise){
                    Toast({ message:'请填写评价内容', duration: 2000 })
                    return
                }
                self.$data.isSub=false
                client.Request({
                    url:'/highs/orderevaluate',
                    type:'POST',
                    data:model,
                    success:function(result){
                        Toast({ message:result.err_msg, duration: 2000 })
                    },
                    complete: function () {
                        self.$data.Type="orderdetail"
                        self.Init()
                        self.$data.isSub=true
                    }
                });
            }
            else if(type=="delete"){//删除
                MessageBox.confirm('订单删除后,您将无法找到该订单。','是否确认要删除该订单？').then(action => {
                    if (action == 'confirm') {
                        self.$data.isSub=false
                        client.Request({
                            url:'/highs/deletesellerorder/'+orderNumber,
                            type:'POST',
                            success:function(result){
                                Toast({ message:result.err_msg, duration: 2000 })
                            },
                            complete: function () {
                                window.location.href = '/seller/order'
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }
        },
        PanelHide:function(type){
            if(type=="deliver"){
                $(".DeliverGoods").hide();
                $("#DeliverGoodmask").hide();
            }else{
                this.$data.Type="orderdetail"
            }
        },
        ChioceScore:function(score){
            this.$data.AppraiseModel.score=score
        },
        SkipProductUrl:function(productId){
            location.href="/higharticle/"+productId
        },
    }
})

