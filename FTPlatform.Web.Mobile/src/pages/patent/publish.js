import imageUploader from "../../components/image-uploader/image-uploader.vue";
import Vue from "vue";
import { GetIdFromUrl } from "../../modules/UrlService";
import * as client from "../../modules/ApiClient";
import * as UrlService from "../../modules/UrlService";
import {Toast,DatetimePicker,Indicator} from "mint-ui";

$(function() {
    
    $(".name_title input,.needs_bg textarea")
        .bind("click", function() {
            $("header").css("position", "absolute");
        })
        .bind("blur", function() {
            $("header").css("position", "fixed");
        });
    //$(".checkboxss").click(function(){
    //    var ischeck=$(this).find('input[type="checkbox"]').prop("checked");
    //    if(ischeck){

    //        $(".money").val("");
    //        $(".money").attr("disabled",true);
    //        $(".money").css({"background":"#ddd"});
            
    //    }else{
    //        $('.money').attr("disabled",false);
    //        $(".money").css({"background":"#fff"})
    //    }
    //})
    
});




Vue.component(DatetimePicker.name, DatetimePicker);

var vm = new Vue({
    el: "#container",
    components: {
        imageUploader,
    },
    data:{
        publishData:[],
        publishmodel:{
            PatentType:null,//专利类型
            PatentStatus:null,//专利状态
            FTPatentImgModel:{PatentCertificate:"",PatentNo:null},//首图 
            Patentee:"",//专利人
            Inventor:"",//发明人
            PantentInfo:"",//专利详情
            AppliTime:"",//日期
            Comment:"",//备注
            Amount:"",//金额
            TradeMode:[],//交易方式
            AuditStatus:"",//审核状态
            PatentName:"",//专利名称
            Industry:"",
            BusinessClassLevel1:0,
        },
        checBox:false,
        PageTitle : '发布技术专利',
        domain:"",
        items:[
            //{text:'',value:"0"},
            {text:'智能制造',value:'1'},
            {text:'新材料',value:'2'},
            {text:'节能环保',value:'3'},
            {text:'新能源',value:'4'},
            {text:'生物医药',value:'5'},
            {text:'化工工程',value:'6'},
            {text:'检测',value:'7'},          
        ],        
    },
    computed:{
        StartDate: function () {
            return new Date('1950-01-01');
        },
        EndDate: function () {
            return new Date();
        },

    },
    created:function(){
        var darr = $("#ApiUrl").val().split("/");
        this.$data.domain = darr.slice(0, darr.length - 1).join("/");

        if (!client.GetCurrentUser()) {
            window.location.href = "/passport/login";
            return;
        }
        client.Request({
            url:'/user/complete',
            type:"get",
            async:false,
            success:function(res){
                if(res && res.err_code == "401"){
                    window.location.href = client.LoginReturn(location.href);
                    return;
                }
                if(res.data == 0 ){
                    $(".prompt").show();
                }
            }
        })
    },
    watch:{
        'publishmodel.FTPatentImgModel.PatentNo':{
            handler: function (val, oldVal) {
                this.$data.publishmodel.FTPatentImgModel.PatentNo = val.replace(/[^\w\.\/]/ig,'');
                //return val.replace(/[^\w\.\/]/ig,'');
            },
            deep: true
        }
    },
    mounted:function(){
        var self = this;
        var id = UrlService.GetIdFromUrl();
        if(id){
            self.$data.PageTitle = '编辑技术专利';
            client.Request({
                url:"/tech/editpatent/"+id,
                type:"get",
                success:function(res){
                    if(res.Code=="200"){
                        self.$data.publishmodel = res.Data; 
                        if(res.Data.Amount == 0 || res.Data.Amount ==""){     
                            self.$data.checBox = true;
                            //$(".checkboxss").checked =true;
                            //$(".money").attr("disabled",true);
                            //$(".money").css({"background":"#ddd"});
                            res.Data.Amount ="";
                        }
                        if(self.$data.publishmodel.TradeMode){
                            self.$data.publishmodel.TradeMode = self.$data.publishmodel.TradeMode.split(",");
                            self.$data.publishmodel.AppliTime = self.formatDate(self.$data.publishmodel.AppliTime);
                        }else{
                            self.$data.publishmodel.TradeMode=[];
                        }
                    }                                    
                },
                complete:function(){
                    self.InitComponents();
                },
            });
        }else{
            self.InitComponents();
        }
    },
    methods:{
        //图片初始
        InitComponents: function() {
           
            var self = this;
            self.$refs.uploader.Init({
                CallBack: function(data) {
                    self.$data.publishmodel.FTPatentImgModel.PatentCertificate = data;
                },
                Action: "/tech/uploadimage"
            });
           
        },
        //时间
        formatDate: function (value, len) {
            if (value != null && value != "") {
                if (len) {
                    return value.substring(0, len);
                } else {
                    return value.substring(0, 10);
                }
            }
        },
        openPicker1:function(){
            this.$refs.dateTimepicker1.open();
        },
        GetApplyTime:function(data){
            this.$data.publishmodel.AppliTime=new Date(data).toLocaleDateString();
        },
        //选择标签
        PickCategory: function() {
            $("body").on("touchmove", function(e){
                e.preventDefault();
            });
            $('#mask').css({
                display: 'block',
                height: "100%"
            });
            $(".popup").css({ "display": "block" });
           
        },
        //面议
        moneyCheckbox:function(){         
            var self = this;
            var ischeck=$(".checkboxss").prop("checked");
            if(ischeck){
                $(".money").attr("disabled",true);
                $(".money").css({"background":"#ddd"});
                self.$data.publishmodel.Amount="";
            }else{
                $('.money').attr("disabled",false);
                $(".money").css({"background":"#fff"})
            }
        },
        optionClick:function(state){           
            this.$data.publishmodel.BusinessClassLevel1 =state;
        },
        //确定
        Confirm:function(){
            $("body").off("touchmove");
            $('#mask').hide();
            $(".popup").hide();
        },
        //上传图片
        UploadImage: function () {
            this.$refs.uploader.Show();
            //if (this.$data.publishmodel.FTPatentImgModel.PatentCertificate != "") {
            //    Toast({message:"只能上传一张首图",duration:1000});
            //} else {
            //    this.$refs.uploader.Show();
            //}
        },
        //删除图片
        RemoveImage: function () {
            this.$data.publishmodel.FTPatentImgModel.PatentCertificate  = "";
        },
        Validate:function(){
            var model = this.$data.publishmodel;
            var isPas = true;

            if(!model.PatentName){
                isPas = false; Toast({message:"专利名称不能为空",duration:1000});
            }else if(model.PatentName.length>50){
                isPas = false; Toast({message:"专利名称长度不能超过50个字",duration:1000});
            }else if(!model.PatentType){
                isPas = false; Toast({message:"请选择专利类型",duration:1000});
            }else if(!model.FTPatentImgModel.PatentCertificate){
                isPas = false; Toast({message:"请上传一张图片",duration:1000});
            }else if(!model.FTPatentImgModel.PatentNo){
                isPas = false; Toast({message:"专利号不能为空",duration:1000});
            }else if(model.FTPatentImgModel.PatentNo.length>100){
                isPas = false; Toast({message:"专利号长度超过100个字",duration:1000});
            }else if(!model.AppliTime){
                isPas = false; Toast({message:"申请日期不能为空",duration:1000});
            }else if(this.$data.checBox !=true&& model.Amount==""){
                isPas = false; Toast({message:"请填写金额或选择面议",duration:1000});
            }else if(!model.PatentStatus){
                isPas = false; Toast({message:"请选择专利状态",duration:1000});
            }else if(!model.TradeMode || !model.TradeMode.length){
                isPas = false; Toast({message:"请选择交易方式",duration:1000});
            }else if(!model.Patentee){
                isPas = false; Toast({message:"专利权人不能为空",duration:1000});
            }else if(model.Patentee.length>50){
                isPas = false; Toast({message:"专利权人长度超过50个字",duration:1000});
            }else if(!model.Inventor){
                isPas = false; Toast({message:"发明人不能为空",duration:1000});
            }else if(model.Inventor.length>50){
                isPas = false; Toast({message:"发明人长度超过50个字",duration:1000});
            }else if(!model.PantentInfo){
                isPas = false; Toast({message:"专利详情不能为空",duration:1000});
            }else if(model.PantentInfo.legnth>1000){
                isPas = false; Toast({message:"专利详情不能长度超过1000个字",duration:1000});
            }else if(model.Comment.length>500){
                isPas = false; Toast({message:"备注长度不能超过500个字",duration:1000});
            }
            return isPas;
        },
        inputVaild:function(){
            this.$data.publishmodel.FTPatentImgModel.PatentNo = this.$data.publishmodel.FTPatentImgModel.PatentNo.replace(/[^\w\.\/]/ig,'');
        },
        //提交  保存
        PostTest:function(status){
            var self = this;
            if (!client.GetCurrentUser()) {
                window.location.href =client.LoginReturn(location.href);
                return;
            }

            self.$data.publishmodel.AuditStatus = status;
            if (!self.Validate()) {
                return false;
            }
            var data = {};
            $.extend(data, self.$data.publishmodel)
            data.TradeMode = data.TradeMode.join(",");
          
            client.Request({
                url:"/tech/releasepatent",
                type:"post",
                data:data,
                success:function(result){
                    if(result.Code =="200"){
                        if (self.$data.publishmodel.AuditStatus == 1) {
                            window.location.href = "/patent/submited";
                            return;
                        }
                        if(self.$data.publishmodel.AuditStatus == 99){
                            window.location.href = "/patent/saved";
                             return;
                        }
                    }               
                    if(result.Code == "208"){
                        Toast({message:result.Message,duration:1000});
                        window.location.href ="/passport/login?" +"returnurl=" +UrlService.GetEncodedUrl();
                        return;
                    }
                    Toast({message:result.Message,duration:1000});                  
                },
                error: function(req, text, err) {}
            })           
        },
    },
    filters: {
        FormatDate: function (date) {
            if (date) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
            return "";
        }
    }
});
