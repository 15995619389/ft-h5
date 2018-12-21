import Vue from "vue";
import scroller from "vue-scroller";
import { GetIdFromUrl,GetUrlParameter } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import { Toast,Indicator,MessageBox } from "mint-ui";

$(function(){
    $(".note_info,.appraise_ul li textarea").bind('click', function () {
        $('header').css('position', 'absolute')
    }).bind('blur', function () {
        $('header').css('position', 'fixed')
    })
})

var vm = new Vue({
    el:"#container",
    components: {
        scroller: scroller.Scroller
    },
    data:{
        orders:[],       
        datamodel:{
            pageSize:10,
            pageIndex:0,
            orderStatus:0
        },
        AfterSale:{type:0,productName:"",quantity:0,amount:"",orderNumber:"",productImg:""},
        AppraiseModel:{orderNumber:"",party:0,appraise:"",score:1},
        isSub:true,
        IsMoreStatusPanelVisiable:false,
        Type:"orderlist"
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
                url:'/highs/buyerorderlist',
                type:'get',
                data:self.$data.datamodel,
                success:function(result){
                    if(result&&result.err_code == "0000"){
                        if(typeof fn == "function"){
                            fn(result);
                        }else{
                            self.$data.orders = result.data;
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
            var data = self.$data;
            data.datamodel.pageIndex = 1;
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
           
            data.datamodel.pageIndex++;
            setTimeout(function(){
                self.Get(function(result){
                    var ismore = true;
                    for (var i = 0; i < result.data.length; i++) {
                        data.orders.push(result.data[i]);
                    }

                    if (result.data && result.data.length > 0)
                        ismore = false;
                    bone(ismore);
                })
            },500);         
        },
        SortStatus:function(status){
            this.$data.datamodel.orderStatus=status
            this.$data.IsMoreStatusPanelVisiable=false

            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        PanelVisibale:function(){
            if(this.$data.IsMoreStatusPanelVisiable){
                this.$data.IsMoreStatusPanelVisiable=false
            }else{
                this.$data.IsMoreStatusPanelVisiable=true
            }
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
                                self.Refresh()
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
                        self.Refresh()
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
                                self.Refresh()
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
                                self.Refresh()
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }
        },
        ProductDetail:function(productId){
            location.href="/higharticle/"+productId
        },
        AppraiseShow:function(ordernumber){
            this.$data.AppraiseModel.orderNumber=ordernumber
            this.$data.Type="appraise"
        },
        AppraiseHide:function(){
            this.$data.Type="orderlist"
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
                        self.$data.Type="orderlist"
                        self.Refresh()
                        self.$data.isSub=true
                    }
                });
            }
        },
        AfterSaleShow:function(orderModel){

            this.$data.AfterSale.productName=orderModel.productname
            this.$data.AfterSale.quantity=orderModel.orderquantity
            this.$data.AfterSale.amount=orderModel.orderamount
            this.$data.AfterSale.orderNumber=orderModel.ordernumber
            this.$data.AfterSale.productImg=orderModel.productimg
            this.$data.Type="aftersale"
        },
        AfterSaleHide:function(){
            this.$data.Type="orderlist"
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
                        self.$data.Type="orderlist"
                        self.Refresh()
                        self.$data.isSub=true
                    }
                });
            }
        },
        SkipUrl:function(ordernumber){
            location.href="/buyer/orderdetail?number="+ordernumber
        }
    }
});
