import Vue from "vue";
import scroller from "vue-scroller";
import { GetIdFromUrl,GetParamUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import { Toast,Indicator,MessageBox } from "mint-ui";

$(function(){
    $("input[type='text'],.appraise_ul li textarea").bind('click', function () {
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
        datamodel:{pageIndex:0,orderStatus:0 },
        AppraiseModel:{orderNumber:"",party:1,appraise:"",score:1},
        DeliveryModel:{orderNumber:"",logisticsCompany:"",logisticsNumber:""},
        isSub:true,
        Type:"orderlist"
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        var status=GetParamUrl("status")
        if(status){
            this.$data.datamodel.orderStatus=status
        }
    },
    methods:{
        Get:function(fn){         
            var self = this;
            client.Request({
                url:'/highs/sellerorderlist',
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

            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
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
                self.$data.Type="deliver"
                self.$data.DeliveryModel.logisticsCompany=''
                self.$data.DeliveryModel.logisticsNumber=''
                self.$data.DeliveryModel.orderNumber=orderNumber
            }
            else if(type=="deliver"){//发货
                var model=self.$data.DeliveryModel
                var r = /^\+?[1-9][0-9]*$/;
                if(!model.logisticsCompany){
                    Toast({ message:"物流公司不能为空", duration: 2000 })
                    return
                }
                else if(model.logisticsCompany.length>100){
                    Toast({ message:"物流公司不能大于100个字", duration: 2000 })
                    return
                }
                else if(!model.logisticsNumber){
                    Toast({ message:"物流单号不能为空", duration: 2000 })
                    return
                }
                else if(!r.test(model.logisticsNumber)){
                    Toast({ message:"物流单号格式不正确", duration: 2000 })
                    return
                }
                else if(model.logisticsNumber.length>100){
                    Toast({ message:"物流单号不能大于100个字", duration: 2000 })
                    return
                }
                self.$data.isSub=false
                client.Request({
                    url:'/highs/delivery',
                    type:'POST',
                    data:model,
                    success:function(result){
                        Toast({ message:result.err_msg, duration: 2000 })
                    },
                    complete: function () {
                        self.PanelHide()
                        self.Refresh()
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
                        self.$data.Type="orderlist"
                        self.Refresh()
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
                                self.Refresh()
                                self.$data.isSub=true
                            }
                        });
                    }
                }).catch(err => { });
            }
        },
        PanelHide:function(type){
            this.$data.Type="orderlist"
        },
        ChioceScore:function(score){
            this.$data.AppraiseModel.score=score
        },
        SkipUrl:function(ordernumber){
            window.location.href="/seller/orderdetail?number="+ordernumber
        },
        ProductDetail:function(productId){
            window.location.href="/higharticle/"+productId
        }
    }
})