import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import {  Toast,Indicator } from 'mint-ui'
import { GetIdFromUrl,GetParamUrl } from '../../modules/UrlService'

var vm = new Vue({
    el: '#container',
    data: {
        productId:0,
        order:{ArticleModel:null,InvoiceModel:null,AddressModel:null},
        orderEnter:{
            InvoiceId:0,
            InvoiceType:0,
            Quantity:0,
            ArticleId:0,
            ShippingAddressId:0,
            BuyRemark:"",
            OrderBill:0
        },
        addressList:[],
        invoiceList:[],
        OperateType:"orderenter",
        isSub:true
    },
    created: function () {
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        if (!GetIdFromUrl()) {
            window.location.href = '/higharticlelist'
            return
        }
        this.Init();
    },
    computed:{
        orderTotal:function(){
            var self=this
            if(self.order.ArticleModel){
                return (self.order.ArticleModel.SalePrice*self.orderEnter.Quantity).toFixed(2)
            }else{
                return self.orderEnter.Quantity*0.00
            }
        }
    },
    methods: {
        Init:function(){
            var _self = this
            var bid=GetParamUrl("bid")!=null?GetParamUrl("bid"):0
            Indicator.open('加载中...')
            client.Request({
                type: 'GET',
                url: '/highs/confirmordershow/' +GetIdFromUrl()+"/"+bid,
                success: function (res) {
                    if(res.Code=="200"){
                        _self.$data.order=res.Data
                        _self.$data.order.ArticleModel.OrderQuantity=parseInt(_self.$data.order.ArticleModel.OrderQuantity)  //起购数量
                        _self.$data.orderEnter.Quantity=_self.$data.order.Quantity                //订单数量
                        _self.$data.orderEnter.OrderBill=_self.$data.order.OrderBill              //报价订单ID
                        _self.$data.orderEnter.ArticleId= _self.$data.order.ArticleModel.Id       //商品ID

                        var addressModel=_self.$data.order.AddressModel
                        if(addressModel!=null){
                            addressModel.Address=addressModel.ProvinceName+" "+addressModel.CityName+" "+addressModel.DistrictName+" "+addressModel.AddressDetails
                            _self.$data.orderEnter.ShippingAddressId=addressModel.Id
                        }
                 
                        var invoiceModel= _self.$data.order.InvoiceModel
                        if(invoiceModel!=null){
                            _self.$data.orderEnter.InvoiceId=invoiceModel.Id
                            _self.$data.orderEnter.InvoiceType=invoiceModel.Type==0?1:invoiceModel.Type==1?2:0
                            invoiceModel.Title=invoiceModel.CompanyName
                            invoiceModel.TypeVal=invoiceModel.HeaderNumber
                        }
                    }else{
                        Toast({ message:res.Message, duration: 1000 })
                    }
                },
                complete: function () {
                    Indicator.close()
                }
            });
        },
        Validate:function(){
            var model=this.$data.orderEnter
            var isPas = true
            if(model.ShippingAddressId==0){
                isPas=false
                Toast({ message:"请选择收货地址", duration: 1000 })
            }else if(model.Quantity==0){
                isPas=false
                Toast({ message:"请选择收购买数量", duration: 1000 })
            }else if(model.ArticleId==0){
                isPas=false
                Toast({ message:"商品信息有误", duration: 1000 })
            }else if(model.BuyRemark&&model.BuyRemark.length>500){
                isPas=false
                Toast({ message:"留言不能大于500个字", duration: 1000 })
            }
            return isPas
        },
        OrderPost:function(){
            var _self=this;
            if(_self.isSub&&_self.Validate()){
                _self.isSub=false
                Indicator.open('提交中...')
                client.Request({
                    type: 'POST',
                    url: '/highs/sumbitorder',
                    data:_self.$data.orderEnter,
                    success: function (res) {
                        if(res.err_code=="0000"){
                            $("#pay").html(res.data);
                        }else{
                            Toast({ message:res.err_msg, duration: 1000 })
                        }                      
                    },
                    complete:function(){
                        _self.isSub=true
                        Indicator.close()
                    }
                })
            }   
        },
        Add:function(){
            this.$data.orderEnter.Quantity+=1
        },
        Minus:function(){
            var _self=this;
            if(_self.$data.orderEnter.Quantity>_self.$data.order.ArticleModel.OrderQuantity){
                _self.$data.orderEnter.Quantity-=1
            }
        },
        AddressShow:function(){
            var _self=this;
            this.$data.OperateType="address";
            client.Request({
                type: 'GET',
                url: '/highs/shipaddresslist',
                data:{pageIndex:1},
                success: function (res) {
                    if(res.Code=="200"){
                        _self.$data.addressList=res.Data
                    }
                }
            })
        },
        AddAddress:function(){
            window.location.href="/buyer/newaddress?returnurl="+encodeURIComponent(location.href)
        },
        AddressHide:function(){
            this.$data.OperateType="orderenter"
        },
        SkipUrl:function(type){
            if(type==1){
                window.location.href="/buyer/address?t=AdministerAddress&returnurl="+encodeURIComponent(location.href)
            }else if(type==2){
                window.location.href="/buyer/invoice?t=invoiceManage&returnurl="+encodeURIComponent(location.href)
            }
        },
        ChoiceAddress:function(index){
            var _self=this;
            this.$data.OperateType="orderenter"
            var newAddress=this.$data.addressList[index]
            var oldAddress =this.$data.order.AddressModel
            if(oldAddress!=null){
                if(oldAddress.Id==newAddress.Id){
                    return
                }
            }
            if(oldAddress==null){
                oldAddress=new Object()
            }
            oldAddress.Id=newAddress.Id
            oldAddress.Consignee=newAddress.Consignee
            oldAddress.Telephone=newAddress.Telephone
            oldAddress.Address=newAddress.Address
            this.$data.order.AddressModel=oldAddress

            _self.$data.orderEnter.ShippingAddressId=oldAddress.Id
            var sub=true
            if(sub){
                sub=false
                client.Request({
                    type: 'POST',
                    url: '/highs/setisdefault/1/'+oldAddress.Id,
                    success: function (res) {
                    },
                    complete:function(){
                        sub=true
                    }
                })
            }
        },
        InvoiceShow:function(){
            var _self=this;
            this.$data.OperateType="invoice"
            client.Request({
                type: 'GET',
                url: '/highs/invoicelist',
                data:{pageIndex:1},
                success: function (res) {
                    if(res.Code=="200"){
                        _self.$data.invoiceList=res.Data
                    }
                }
            })
        },
        InvoiceHide:function(){
            this.$data.OperateType="orderenter"
        },
        ChoiceInvoice:function(index){
            var _self=this;
            this.$data.OperateType="orderenter"
            var invoiceId=0
            var invoiceType=0
            var oldInvoice=_self.$data.order.InvoiceModel
            if(oldInvoice==null&&index==-1){             
                return
            }
            if(oldInvoice!=null&&index!=-1){
                var newInvoice=_self.$data.invoiceList[index]
                if(oldInvoice.invoiceId==newInvoice.invoiceId){
                    return
                }
            }

            if(index==-1){
                _self.$data.order.InvoiceModel=null
            }else{
                var newInvoice=_self.$data.invoiceList[index]
            
                if(oldInvoice==null){
                    oldInvoice=new Object();
                }
                invoiceId=newInvoice.Id
                invoiceType=newInvoice.Type==0?1:newInvoice.Type==1?2:0
                oldInvoice.Id=invoiceId
                oldInvoice.Type=newInvoice.Type
                oldInvoice.Title=newInvoice.Title
                oldInvoice.TypeVal=newInvoice.TypeVal
                _self.$data.order.InvoiceModel=oldInvoice
            }
            _self.$data.orderEnter.InvoiceId=invoiceId
            _self.$data.orderEnter.InvoiceType=invoiceType

            var sub=true
            if(sub){
                sub=false
                client.Request({
                    type: 'POST',
                    url: '/highs/setisdefault/2/'+invoiceId,
                    success: function (res) {
                    },
                    complete:function(){
                        sub=true
                    }
                })
            }
        }
    }
});
