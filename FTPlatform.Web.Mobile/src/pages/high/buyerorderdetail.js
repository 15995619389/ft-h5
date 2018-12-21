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
            InvoiceModel:null
        },
        AfterSale:{type:0,describe:"",quantity:0,amount:"",orderNumber:""},
        AppraiseModel:{orderNumber:"",party:0,appraise:"",score:1},
        Type:"orderdetail",
        isSub:true
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if(!GetParamUrl("number")){
            window.location.href = '/buyer/order'
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
                url:'/highs/buyerorderdetail/'+self.$data.order.ordernumber,
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
            var self=this
            if(!client.IsLogin()){
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            if(!self.$data.isSub){
                return
            }
            if(type=="cancel"){
                MessageBox.confirm('您可在我的订单-已取消 中查看订单。','是否确认要取消该订单？').then(action => {
                    if (action == 'confirm') {
                        self.$data.isSub=false
                        client.Request({
                            url:'/highs/buyerorderoperate/'+orderNumber+'/'+1,
                            type:'POST',
                            success:function(result){
                                Toast({ message:result.err_msg, duration: 2000 })
                            },
                            complete: function () {
                                self.Init()
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }else if(type=="payment"){
                self.$data.isSub=false
                client.Request({
                    url:'/highs/paymentorder/'+orderNumber,
                    type:'POST',
                    success:function(result){
                        if(result.err_code=="0000"){
                            $("#pay").html(result.data);
                            return
                        }
                        Toast({ message:result.err_msg, duration: 2000 })
                    },
                    complete: function () {
                        self.$data.isSub=true
                    }
                });
            }else if(type=="expediting"){
                self.$data.isSub=false
                client.Request({
                    url:'/highs/buyerorderoperate/'+orderNumber+'/'+2,
                    type:'POST',
                    success:function(result){
                        Toast({ message:result.err_msg, duration: 2000 })
                    },
                    complete: function () {
                        self.Init()
                        self.$data.isSub=true
                    }
                });
            }else if(type=="confirm"){
                MessageBox.confirm('确认收货后款项将打给卖家。','是否确认收货吗？').then(action => {
                    if (action == 'confirm') {
                        self.$data.isSub=false
                        client.Request({
                            url:'/highs/buyerorderoperate/'+orderNumber+'/'+3,
                            type:'POST',
                            success:function(result){
                                Toast({ message:result.err_msg, duration: 2000 })
                            },
                            complete: function () {
                                self.Init()
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }
            else if(type=="delete"){
                MessageBox.confirm('订单删除后,您将无法找到该订单。','是否确认要删除该订单？').then(action => {
                    if (action == 'confirm') {
                        self.$data.isSub=false
                        client.Request({
                            url:'/highs/buyerorderoperate/'+orderNumber+'/'+4,
                            type:'POST',
                            success:function(result){
                                Toast({ message:result.err_msg, duration: 2000 })
                            },
                            complete: function () {
                                window.location.href = '/buyer/order'
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }
        },
        SkipUrl:function(ordernumber){
            location.href="/buyer/orderdetail?number="+ordernumber
        },
        SkipProductUrl:function(productId){
            location.href="/higharticle/"+productId
        },
        AppraiseShow:function(ordernumber){
            this.$data.AppraiseModel.orderNumber=ordernumber
            this.$data.Type="appraise"
        },
        AppraiseHide:function(){
            this.$data.Type="orderdetail"
        },
        ChioceScore:function(score){
            this.$data.AppraiseModel.score=score
        },
        AppraisePost:function(){
            var self=this
            if(!client.IsLogin()){
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            var model=this.$data.AppraiseModel

            if(!model.appraise){
                Toast({ message:'请填写评价内容', duration: 2000 })
                return
            }
            if(this.$data.isSub){
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
        },
        AfterSaleShow:function(describe,quantity,amount,ordernumber){
            this.$data.AfterSale.describe=describe
            this.$data.AfterSale.quantity=quantity
            this.$data.AfterSale.amount=amount
            this.$data.AfterSale.orderNumber=ordernumber
            this.$data.Type="aftersale"
        },
        AfterSaleHide:function(){
            this.$data.Type="orderdetail"
        },
        ChoiceAfterSaleType:function(status){
            this.$data.AfterSale.type=status
        },
        AfterSalePost:function(){
            var self=this;
            if(!client.IsLogin()){
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            var model=this.$data.AfterSale
            if(model.type==0){
                Toast({ message:'请选择售后服务类型', duration: 2000 })
                return
            }
            if(this.$data.isSub){
                self.$data.isSub=false
                client.Request({
                    url:'/highs/subaftersale',
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
        }
    }
})
