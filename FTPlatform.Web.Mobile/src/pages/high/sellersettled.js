import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import {  Toast,Indicator } from 'mint-ui'
import preview from "../../components/img-preview.vue";

var vm = new Vue({
    el: '#container',
    components: {
        preview
    },
    data: {
        PanelType:0,
        SettledAudit:{code:0,messageinfo:"",failurereason:"",AuditImg:"/Content/image/passwored_ok.png"},
        Merchant:{MerchantImgList:[]},
        isSub:true,
        domain: '',
        BusinessLicenseImg:null,        //营业执照
        BusinessCardImg:null,           //个人名片
        CompanyLogoImg:null,            //企业LOGO
        OtherCertificatesImg:[],        //其他资质证书
        OpenLicenseImg:null             //开户证许可
    },
    created:function(){
        if(!client.IsLogin()){
            window.location.href = client.LoginReturn(window.location.href)
            return
        }
        var darr = $('#ApiUrl').val().split('/');
        this.$data.domain = darr.slice(0, darr.length - 1).join('/');
        this.Init()
    },
    methods: {
        Init:function(){
            var self=this;
            var user=client.GetCurrentUser()
            if(user.IsMerchant){
                location.href="/Seller"
            }
            client.Request({
                url:'/highs/settledauditstate',
                type:'GET',
                success:function(result){
                    if(result.Code=="200"||result.Code=="201"||result.Code=="202"){
                        self.$data.SettledAudit.code=parseInt(result.Code)
                        if(result.Code=="200"){
                            location.href="/seller"
                        }else if(result.Code=="201"){
                            self.PanelType=3
                            self.$data.SettledAudit.AuditImg="/Content/image/error.png"
                            self.$data.SettledAudit.messageinfo="审核未通过"
                            self.$data.SettledAudit.failurereason=result.Message
                            self.$data.Merchant=result.Data
                            if(result.Data){
                                $(result.Data.MerchantImgList).each(function(i,o){
                                    self.ImgModelEval(o.ImgPath,o.Type)
                                });
                            }
                        }else{
                            self.PanelType=3
                            self.$data.SettledAudit.messageinfo="您的入驻申请已提交"
                            self.$data.SettledAudit.failurereason="平台将会在1个工作日内审核，期间请保持电话畅通"
                        }      
                    }else{
                        self.PanelType=1
                        var merchantObj={
                            CompanyName:user.CompanyName,
                            Contact:user.RealName,
                            Position:user.Position,
                            ContactWay:user.Mobile
                        }
                        self.Merchant=merchantObj
                    }
                },
                complete: function () {
                }
            });
        },
        SettledNext:function(status){
            if(status!=2&&(this.$data.SettledAudit.code==201||this.$data.SettledAudit.code==202)){
                this.$data.PanelType=3
            }else{
                this.$data.PanelType=status
            }
        },
        SettledPost:function(){
            var self=this;
            var model=this.$data.Merchant
            model.MerchantImgList=[]
            if(self.$data.isSub&&this.Validate()){
                if(self.$data.BusinessLicenseImg!=null){
                    model.MerchantImgList.push(self.$data.BusinessLicenseImg);
                }
                if(self.$data.BusinessCardImg!=null){
                    model.MerchantImgList.push(self.$data.BusinessCardImg);
                }
                if(self.$data.CompanyLogoImg!=null){
                    model.MerchantImgList.push(self.$data.CompanyLogoImg);
                }
                if(self.$data.OtherCertificatesImg.length>0){
                    $(self.$data.OtherCertificatesImg).each(function(i,o){
                        model.MerchantImgList.push(o)
                    });
                }
                if(self.$data.OpenLicenseImg!=null){
                    model.MerchantImgList.push(self.$data.OpenLicenseImg);
                }
                self.$data.isSub=false
                Indicator.open('提交中,请稍等...')
                client.Request({
                    type: 'post',
                    url: '/highs/submerchantsettled',
                    data: model,
                    success: function (result) {
                        if (result.Code == '200') {
                            self.PanelType=3
                            self.$data.SettledAudit.code=202
                            self.$data.SettledAudit.messageinfo="您的入驻申请已提交"
                            self.$data.SettledAudit.failurereason="平台将会在1个工作日内审核，期间请保持电话畅通"
                            self.$data.SettledAudit.AuditImg="/Content/image/passwored_ok.png"
                        } else {
                            Toast({ message: result.Message, duration: 1000 });
                        }
                    },
                    complete: function (result) {
                        self.$data.isSub = true;
                        Indicator.close();
                    }
                })
            }
        },
        Validate:function(){
            var model=this.$data.Merchant
            var isPas = true
            var reg = new RegExp("^[0-9]*$");
            if (!model.CompanyName) {
                isPas = false;
                Toast({ message: '企业名称不能为空', duration: 1000 });
            }
            else if(model.CompanyName.length>100){
                isPas = false;
                Toast({ message: '企业名称不能大于100个字', duration: 1000 });
            }
            else if (!model.SocialCreditCode) {
                isPas = false;
                Toast({ message: '统一社会信用代码不能为空', duration: 1000 });
            }
            else if(model.SocialCreditCode.length>100){
                isPas = false;
                Toast({ message: '统一社会信用代码不能大于100个字', duration: 1000 });
            }
            else if (!this.$data.BusinessLicenseImg) {
                isPas = false;
                Toast({ message: '请上传企业营业执照', duration: 1000 });
            }
            else if (!model.ContactAddress) {
                isPas = false;
                Toast({ message: '联系地址不能为空', duration: 1000 });
            }
            else if(model.ContactAddress.length>100){
                isPas = false;
                Toast({ message: '联系地址不能大于100个字', duration: 1000 });
            }
            else if (!model.Contact) {
                isPas = false;
                Toast({ message: '联系人不能为空', duration: 1000 });
            }
            else if(model.Contact.length>50){
                isPas = false;
                Toast({ message: '联系人不能大于50个字', duration: 1000 });
            }
            else if (!model.Position) {
                isPas = false;
                Toast({ message: '职位不能为空', duration: 1000 });
            }
            else if(model.Position.length>100){
                isPas = false;
                Toast({ message: '职位不能大于100个字', duration: 1000 });
            }
            else if (!model.ContactWay) {
                isPas = false;
                Toast({ message: '联系方式不能为空', duration: 1000 });
            }
            else if(model.ContactWay.length>50){
                isPas = false;
                Toast({ message: '联系方式不能大于50个字', duration: 1000 });
            }
            else if (!this.$data.BusinessCardImg) {
                isPas = false;
                Toast({ message: '请上传个人名片', duration: 1000 });
            }
            else if (!model.BankName) {
                isPas = false;
                Toast({ message: '开户银行不能为空', duration: 1000 });
            }
            else if(model.BankName.length>50){
                isPas = false;
                Toast({ message: '开户银行不能大于50个字', duration: 1000 });
            }
            else if (!model.BankAccount) {
                isPas = false;
                Toast({ message: '户名不能为空', duration: 1000 });
            }
            else if(model.BankAccount.length>50){
                isPas = false;
                Toast({ message: '户名不能大于50个字', duration: 1000 });
            }
            else if (!model.CardNo) {
                isPas = false;
                Toast({ message: '卡号不能为空', duration: 1000 });
            }
            else if(!reg.test(model.CardNo)){
                isPas = false;
                Toast({ message: '卡号格式不正确', duration: 1000 });
            }
            else if(model.CardNo.length>50){
                isPas = false;
                Toast({ message: '卡号不能大于50个字', duration: 1000 });
            }
            else if (!this.$data.OpenLicenseImg) {
                isPas = false;
                Toast({ message: '请上传开户许可证', duration: 1000 });
            }
            return isPas
        },
        ImgModelEval:function(imgUrl,type){
            var self=this
            if(type==1){
                self.$data.BusinessLicenseImg={ImgPath:imgUrl,Type:type}
            }
            else if(type==2){
                self.$data.BusinessCardImg={ImgPath:imgUrl,Type:type}
            }
            else if(type==3){
                self.$data.CompanyLogoImg={ImgPath:imgUrl,Type:type}
            }
            else if(type==4){
                self.$data.OtherCertificatesImg.push({ImgPath:imgUrl,Type:type})
            }else{
                self.$data.OpenLicenseImg={ImgPath:imgUrl,Type:type}
            }
        },
        RemoveImg:function(type,index){
            var self=this
            if(type==1){
                self.$data.BusinessLicenseImg=null
            }else if(type==2){
                self.$data.BusinessCardImg=null
            }
            else if(type==3){
                self.$data.CompanyLogoImg=null
            }
            else if(type==4){
                self.$data.OtherCertificatesImg.splice(index,1)
            }
            else if(type==5){
                self.$data.OpenLicenseImg=null
            }
        },
        ShowPreview: function(imgurl) {
            this.$refs.preview.Show(imgurl);
        }
    }
})

$(document).on("change","input[type='file']",function(event){
    var fileObject= $(this)[0]
    var type=$("#"+fileObject.id).attr("imagetype");

    fileUpload(fileObject.id,type)
    event.stopPropagation();
})

var fileUpload=function(element,type){
    var formData = new FormData();
    formData.append('moduleName', 'Seller');
    if(!vm.$data.isSub){
        return
    }
    var fileName=$("#"+element)
    if(fileName.val()!=""&&fileName!=null){
        var files = fileName.get(0).files;
        if(type!=4&&files.length>1){
            Toast({ message: '只允许上传一个文件', duration: 2000 });
            replaceFile(element,type)
            return;
        }
        var lastIndex = files[0].name.lastIndexOf('\.');
        var fileType = files[0].name.substring(lastIndex + 1, files[0].name.length);

        if (fileType != null && fileType != '' && fileType != undefined) {
            fileType=fileType.toLowerCase()
            if (fileType != 'jpg'&&fileType!='jpeg' && fileType != 'png' && fileType != 'gif') {
                Toast({ message: '上传文件只支持jpg,jpeg,png,gif', duration: 2000 });
                replaceFile(element,type)
                return;
            }
        }else{
            Toast({ message: '文件格式有问题', duration: 2000 });
            replaceFile(element,type)
            return;
        }
        var maxsize = 2*1024*1024;//2M
        if (files[0].size >=maxsize) {
            Toast({ message: '上传文件不能大于2M', duration: 2000 });
            replaceFile(element,type)
            return;
        }
        formData.append('File' + 0, files[0]);
    }
    vm.$data.isSub=false
    client.Request({
        type: 'POST',
        url: '/common/uploadfile',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (result, status) {
            if (result.err_code == '0000') {
                if(type!=4){
                    vm.ImgModelEval(result.data[0],type)
                }else{
                    $(result.data).each(function(i,o){
                        vm.ImgModelEval(o,type)
                    });
                }   
            } else {
                Toast({ message: result.err_msg, duration: 1000 });
            }
        },
        error: function (xhr, status, err) {
            Toast({ message: '上传失败', duration: 1000 });
        },
        complete: function (result) {
            replaceFile(element,type)
            vm.$data.isSub = true;
        }
    })
}

var replaceFile=function(element,type){
    if(type==4){
        $("#OtherCertificates").replaceWith('<input type="file" accept="image/*" id="OtherCertificates" imagetype="4" />'); 
    }else{
        $("#"+element).replaceWith('<input type="file" accept="image/*" id="'+element+'" imagetype="'+type+'" style="position:absolute;top:0;opacity:0" />'); 
    }
}