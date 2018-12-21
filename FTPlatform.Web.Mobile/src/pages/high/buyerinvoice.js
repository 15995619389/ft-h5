import Vue from 'vue';
import * as client from '../../modules/ApiClient';
import { Popup, Toast,Indicator,MessageBox } from 'mint-ui';
import { GetIdFromUrl,GetParamUrl } from '../../modules/UrlService';
import scroller from "vue-scroller";

$(function () {
    $('input[type="text"],textarea')
        .bind('click', function () {
            $('header').css('position', 'absolute')
        })
        .bind('blur', function () {
            $('header').css('position', 'fixed')
        })
})


var vm = new Vue({
    el:"#container",
    components:{
        scroller: scroller.Scroller,
    },
    data:{
        Invoices:[],
        InvoiceModel:{Type:0,TitleType:0,IsDefault:true},
        invoiceType:"invoiceList",
        isSub:true
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        this.Init("first");
    },
    methods:{
        Init:function(done){
            var self = this;
            if(done){
                Indicator.open("加载中...")
            }

            var data = self.$data;
            var type=GetParamUrl("t")
            if(type){
                self.$data.invoiceType=type
            }
            client.Request({
                url:"/highs/invoicelist",
                type:"get",
                data:{pageIndex:1},
                success:function(result){
                    if(result.Code == "200"){
                        if(result.Data.length==0){
                            $(".invoiceNoData").show()
                            data.Invoices=[]
                        }else{
                            data.Invoices = result.Data
                        }
                    }
                },
                complete:function(){
                    if(done){
                        Indicator.close()
                    }
                }
            });
        },
        //删除发票
        Delete:function(id){
            var self = this;
            var data = self.$data;
            MessageBox.confirm('是否要删除该发票?',"提示").then(action => {
                if (action == 'confirm') {
                    client.Request({
                        url:"/highs/invoice/"+id,
                        type:'post',
                        success:function(result){
                            if(result.Code =="200"){
                                self.Init();
                            }
                            Toast({message:result.Message,duration:1000});
                        }
                    });
                }
            }).catch(err => { })
        },
        UpdateShow:function(id){
            var self = this;
            self.$data.invoiceType="updateInvoice"
            client.Request({
                url:'/highs/invoice/'+id,
                type:'get',
                success:function(result){
                    if(result.Code=="200"){
                        self.$data.InvoiceModel=result.Data
                    }
                }
            });
        },
        AddShow:function(){
            var self = this;
            self.$data.InvoiceModel=null
            self.$data.InvoiceModel={Type:0,TitleType:0,IsDefault:true}
            self.$data.invoiceType="addInvoice"
        },
        //设为默认
        invoiceDefault:function(id,index){
            var self = this;
            var invoice=self.$data.Invoices[index]
            if(invoice.IsDefault){
                return
            }

            if(self.$data.isSub){
                self.$data.isSub=false
                client.Request({
                    type: 'POST',
                    url: '/highs/setisdefault/2/'+id,
                    success: function (result) {
                        $(self.$data.Invoices).each(function(i,o){
                            if(o.IsDefault){
                                o.IsDefault=false
                            }
                            if(o.Id==id){
                                o.IsDefault=true
                            }
                        })
                        Toast({message:result.Message,duration:1000});   
                    },
                    complete:function(){
                        self.$data.isSub=true
                    }
                })
            }
        },
        ManageShow:function(){
            this.$data.invoiceType="invoiceManage";
        },
        ListShow:function(){
            this.$data.invoiceType="invoiceList"
        },
        ChoiceType:function(type){
            var self=this
            if(type==0){
                if(self.$data.InvoiceModel.HeaderNumber){
                    self.$data.InvoiceModel.HeaderNumber=""
                }
                if(self.$data.InvoiceModel.TaxesNumbe){
                    self.$data.InvoiceModel.TaxesNumbe=""
                }
            }else if(type==1){
                if(self.$data.InvoiceModel.TaxesNumbe){
                    self.$data.InvoiceModel.TaxesNumbe=""
                }
            }

            this.$data.InvoiceModel.Type=type
        },
        ChoiceTitleType:function(titleType){
            var self=this
            if(titleType==0){
                if(self.$data.InvoiceModel.HeaderNumber){
                    self.$data.InvoiceModel.HeaderNumber=""
                }
            }else if(titleType==1){
                if(self.$data.InvoiceModel.HeaderNumber){
                    self.$data.InvoiceModel.HeaderNumber=""
                }
                if(self.$data.InvoiceModel.TaxesNumbe){
                    self.$data.InvoiceModel.TaxesNumbe=""
                }
            }
            this.$data.InvoiceModel.TitleType=titleType
        },
        Post:function(){
            var self=this
            var model=this.$data.InvoiceModel
            if(model.Type==0){
                if(!model.HeaderNumber){
                    Toast({message:'发票抬头不能为空',duration:1000});   
                    return
                }
                if(model.TitleType==1&&!model.TaxesNumbe){
                    Toast({message:'纳税人识别号不能为空',duration:1000});   
                    return
                }
            }
            else if(model.Type==1){
                var reg = new RegExp("^[0-9]*$");
                if(!model.CompanyName){
                    Toast({message:'公司名称不能为空',duration:1000});   
                    return
                }
                if(!model.TaxesNumbe){
                    Toast({message:'纳税人识别号不能为空',duration:1000});   
                    return
                }
                if(!model.CompanyAddress){
                    Toast({message:'注册地址不能为空',duration:1000});   
                    return
                }
                if(!model.Telephone){
                    Toast({message:'注册电话不能为空',duration:1000});   
                    return
                }
                if(!reg.test(model.Telephone))
                {
                    Toast({message:'注册电话格式不正确',duration:1000});   
                    return
                }
                if(!model.OpeningBank){
                    Toast({message:'开户银行不能为空',duration:1000});   
                    return
                }
                if(!model.AccountNumbe){
                    Toast({message:'开户账号不能为空',duration:1000});   
                    return
                }
                if(!reg.test(model.AccountNumbe)){
                    Toast({message:'开户账号格式不正确',duration:1000});   
                    return
                }
            }
            if(self.$data.isSub){
                self.$data.isSub=false
                client.Request({
                    type: 'POST',
                    url: '/highs/invoiceedit',
                    data:model,
                    success: function (result) {
                        if(result.Code=="200"){
                            if(GetParamUrl("returnurl")){
                                window.location.href=GetParamUrl("returnurl")
                            }else{
                                self.ManageShow()
                                self.Init();
                            }
                        }
                        Toast({message:result.Message,duration:1000});   
                    },
                    complete:function(){
                        self.$data.isSub=true
                    }
                })

            }
        }
    }
})
