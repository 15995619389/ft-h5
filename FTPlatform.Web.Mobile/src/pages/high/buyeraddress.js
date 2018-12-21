import Vue from 'vue';
import * as client from '../../modules/ApiClient';
import { Popup, Toast,MessageBox } from 'mint-ui';
import { GetIdFromUrl,GetParamUrl } from '../../modules/UrlService';
import scroller from "vue-scroller";

$(function(){
    $("#city").click(function (e) {
        $("#mask").show();
        SelCity(this, e);        
    });
})

var vm = new Vue({
    el:"#container",
    data:{
        TakeModel:[],//收货地址
        AdministerModel:[],//管理
        EditModel:{
            ProvinceId:0,//省份id
            ProvinceName:"",//省份名称
            CityId:0,//城市id
            CityName:"",//城市名称
            DistrictId:0,//区县id
            DistrictName:"",//区县名称
            AddressText:"",
        },//编辑
        AddressType:"TakeAddress",
        isSub:true,
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        
        this.Init();
    },
    
    methods:{
        Init:function(){
            var self = this;
            var data = self.$data;
            var type=GetParamUrl("t")
            if(type){
                self.$data.AddressType=type
            }
            client.Request({
                url:'/highs/shipaddresslist',
                type:'get',
                data:{pageIndex:1},
                success:function(result){   
                    if(result.Code =="200"){
                        data.TakeModel = result.Data
                    }
                }
            });
        },
        //点击mask
        maskHide:function(){
            $("#mask").hide();
            $("#PoPy").hide();
        },

        //删除
        Deleting:function(id){
            var self = this;
            var data = self.$data;
            MessageBox.confirm('是否要删除该地址?',"提示").then(action => {
                client.Request({
                    url:"/highs/shipaddress/"+id,
                    type:'post',
                    success:function(result){
                        if(result.Code =="200"){
                            self.Init();
                        }
                        Toast({message:result.Message,duration:1000});
                    }
                });
            }).catch(err => { })
        },
        //编辑地址
        EditAddress:function(id){
            var self = this;
            this.$data.AddressType="EditAddress";
            client.Request({
                url:"/highs/shipaddress/"+id,
                type:"get",
                data:self.$data.EditModel,
                success:function(result){
                    if(result.Code=="200"){
                        self.$data.EditModel = result.Data;                       
                        self.$data.EditModel.AddressText = result.Data.ProvinceName + ' '+ result.Data.CityName+' '+ result.Data.DistrictName;
                    }
                }
            });

        },
        Validate:function(){
           
            var model = this.$data.EditModel;
            
            model.ProvinceId = $("#ProvinceId").val();
            model.ProvinceName = $("#ProvinceName").val();
            model.CityId = $("#CityId").val();
            model.CityName = $("#CityName").val();
            model.DistrictId = $("#DistrictId").val();
            model.DistrictName = $("#DistrictName").val();

            model.AddressText = model.ProvinceName+ model.CityName+ model.DistrictName
            var isPas = true;
            var reg = new RegExp("^[0-9]*$");
            if(!model.Consignee){
                isPas = false; Toast({message:"收货人名称不能为空",duration:1000});
            }
            else if(!model.Telephone){
                isPas = false; Toast({message:"手机号码不能为空",duration:1000});
            }
            else if(!reg.test(model.Telephone)||model.Telephone.length!=11){
                isPas = false; Toast({message:"手机号码格式不正确",duration:1000});
            }
            else if(!model.ProvinceName || !model.CityName || !model.DistrictName){
                isPas = false; Toast({message:"请选择正确的地址",duration:1000});
            }
            else if(!model.AddressDetails){
                isPas = false; Toast({message:"请填写详细地址",duration:1000});
            }

            return isPas;

        },
        //编辑完成后提交地址
        AddressPost:function(){
            var self = this;

            if (!self.Validate()) {
                return false;
            }

            var data = {};
            $.extend(data, self.$data.EditModel)

            client.Request({
                url:"/highs/shipaddressedit",
                type:"post",
                data:data,
                success:function(result){
                    if(result.Code == "200"){
                        Toast({message:result.Message,duration:1000});  
                        self.$data.AddressType="TakeAddress";
                        self.Init()
                    }
                    Toast({message:result.Message,duration:1000});
                },
            });
        },

        Default:function(id,index){
            var self = this;
            var address=self.$data.TakeModel[index]
            if(address.IsDefault){
                return
            }
            var sub=true
            if(sub){
                sub=false
                client.Request({
                    type: 'POST',
                    url: '/highs/setisdefault/1/'+id,
                    success: function (result) {
                        $(self.$data.TakeModel).each(function(i,o){
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
                        sub=true
                    }
                })
            }     
        },

        //管理收货地址
        TakeManageShow:function(){
            this.$data.AddressType="AdministerAddress"
        },
        //
        TakeAddressShow:function(){
            this.$data.AddressType="TakeAddress"
        },
        SkipAdd:function(){
            var url="/buyer/newaddress"
            if(GetParamUrl("returnurl")){
                url=url+"?returnurl="+encodeURIComponent(GetParamUrl("returnurl"))
            }
            window.location.href=url
        }
    },

});