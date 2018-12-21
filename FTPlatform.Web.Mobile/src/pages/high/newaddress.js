import Vue from 'vue';
import * as client from '../../modules/ApiClient';
import { Popup, Toast,MessageBox } from 'mint-ui';
import { GetIdFromUrl,GetParamUrl } from '../../modules/UrlService';

$(function(){
    $("#city").click(function (e) {
        $("#mask").show();
        SelCity(this, e);
    });
})

var vm = new Vue({
    el:"#container",
    data:{
        NewAddressText:{
            Consignee:"",//收货人           
            ProvinceId:0,//省份id
            ProvinceName:"",//省份名称
            CityId:0,//城市id
            CityName:"",//城市名称
            DistrictId:0,//区县id
            DistrictName:"",//区县名称
            AddressDetails:"",//详细地址
            Telephone:"",//联系方式
            IsDefault:true,
        },
    },
    methods:{ 
        //点击mask
        maskHide:function(){
            $("#mask").hide();
            $("#PoPy").hide();
        },
        Validate:function(){
            var model = this.$data.NewAddressText;            

            model.ProvinceId = $("#ProvinceId").val();
            model.ProvinceName = $("#ProvinceName").val();
            model.CityId = $("#CityId").val();
            model.CityName = $("#CityName").val();
            model.DistrictId = $("#DistrictId").val();
            model.DistrictName = $("#DistrictName").val();    
            var reg = new RegExp("^[0-9]*$");
            var isPas = true;
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
        //保存并使用
        PostAddress:function(){
            
            var self = this;
            if (!client.GetCurrentUser()) {
                window.location.href =client.LoginReturn(location.href);
                return;
            }
            if (!self.Validate()) {
                return false;
            }
            var data = {};
            $.extend(data, self.$data.NewAddressText)

            client.Request({
                url:"/highs/shipaddressedit",
                type:"post",
                data:data,
                success:function(result){                  
                    Toast({message:result.Message,duration:1000}); 
                    if(result.Code=="200"){
                        if(GetParamUrl("returnurl")){
                            window.location.href=GetParamUrl("returnurl")
                        }else{
                            window.location.href="/buyer/address"
                        }
                    }
                }
            })
        },
    },
})