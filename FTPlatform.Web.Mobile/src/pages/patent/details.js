import Vue from "vue";
import * as client from "../../modules/ApiClient";
import { GetIdFromUrl } from "../../modules/UrlService";
import share from "../../components/share/Share.vue";
import preview from "../../components/img-preview.vue";
import { Popup,Toast } from "mint-ui";
import rightsidebar from "../../components/RightSideBar.vue";

var vm = new Vue({
    el:"#container",
    components:{
        popup: Popup,
        share,
        preview,
        rightsidebar
    },
    data:{
        panentDetails:{
            PatentCertificate:"",
            transact:""
        },
        SubData:{},
        recommendUl:[],
        IsPopupVisiable: false,
        PopupMessage:"",
        PopupUrl:"",
        Solveable:true,
        ButtonColor:true,
        currentUser:null,
        TradeModeList:[],
        TradeModeId:0
    },
    created(){   
        var self = this; 
        if (!GetIdFromUrl()) {           
            window.location.href = "/patent";
            return;
        }
        this.$data.currentUser = client.GetCurrentUser();    
        this.InitData();
    },
    methods:{
        InitData:function(){
            var self = this;
            client.Request({            
                url:"/tech/patentdetail/"+GetIdFromUrl(),
                type:"get",
                success:function(res){
                    if(res.Code =="200"){
                        self.$data.panentDetails = res.Data.FTPatent;
                        self.$data.recommendUl = res.Data.RecommendPatents;
               
                        self.$data.TradeModeId=res.Data.FTPatent.TradeModeObj[0].Id;

                        self.$data.TradeModeList =res.Data.FTPatent.TradeModeObj;
                    } 
                    self.SetButton();
                },
                error:function(err){
               
                }
            })
        },

        Follow:function(){
            this.$refs.share.Show();
        },
        ShowPreview: function () {
            this.$refs.preview.Show(this.$data.panentDetails.PatentCertificate);
        },
        RecommendDetail: function(aa) {
            window.location.href = "/patent/details/" + aa.Id;
        },
        
        //申请状态
        SetButton:function(){
            var self = this;            
            if(self.$data.panentDetails.ApplyStatus == 0){
                self.$data.Solveable = true;
                self.$data.ButtonColor = true;
                return;
            }
            if(self.$data.panentDetails.ApplyStatus == 1){               
                self.$data.Solveable = false;
                self.$data.ButtonColor = false;
                return;
            }
            if(self.$data.panentDetails.ApplyStatus == 2){
                self.$data.Solveable = false;
                self.$data.ButtonColor = false;
                return;
            }
            if(self.$data.panentDetails.ApplyStatus == 3){
                self.$data.Solveable = false;
                self.$data.ButtonColor = false;
                return;
            }
            if(self.$data.panentDetails.ApplyStatus == 4){
                self.$data.Solveable = false;
                self.$data.ButtonColor = false;
                return;
            }
            if(self.$data.panentDetails.ApplyStatus == 5){
                self.$data.Solveable = false;
                self.$data.ButtonColor = false;
                return;
            }
            self.$data.Solveable = true;
            self.$data.ButtonColor = true;
            return;
        },
        //
        Hide:function(){
            var self =this;
            $("#mask").hide();
            $(".SubPopup").removeClass("Hide_block");
        },
        Solve:function(){
            var self = this;           
            if(self.$data.panentDetails.ApplyStatus == 0){
                $(".SubPopup").addClass("Hide_block");
                $('#mask').show();
            }
            if(!this.$data.Solveable){
                return;
            }
            if (this.$data.currentUser) {
                return;
            } else {
                $(".SubPopup").removeClass("Hide_block");
                $("#mask").hide();
                this.PopupLogin();
            }
        },
        //选择交易方式
        DealWay:function(id){
            var self = this;
            self.$data.TradeModeId=id;
        },
        //提交
        ApplyDeal:function(){
            var self = this;
            client.Request({
                url:"/tech/SubApplyPatent/"+this.$data.panentDetails.Id+"/"+this.$data.TradeModeId,
                type:"post",
                success:function(res){
                    if(res.Code == "200"){
                        window.location.href="/patent/applyok/";
                    }else if(res.Code =="201"){
                        Toast({message:res.Message,duration:1000});
                    }else if(res.Code =="202"){
                        Toast({message:res.Message,duration:1000});
                    }else{
                        Toast({message:res.Message,duration:1000});
                    }
                }
            })
        },

        //Popup 相关
        PopupRedirect: function() {
            window.location.href = this.$data.PopupUrl;
        },
        HidePopup: function() {
            this.$data.IsPopupVisiable = false;
        },
        PopupLogin: function() {
            this.$data.PopupMessage = "登录后继续，是否登录？";
            this.$data.PopupUrl =
                "/passport/login?returnurl=" +
                encodeURIComponent("/patent/details/" + this.$data.panentDetails.Id);
            this.$data.IsPopupVisiable = true;
        },

    }
}) 
$(".mui-title ul li").click(function(){
    $(this).addClass("text_color").siblings().removeClass("text_color");
    $(".mui-content .PanentDetails_box").css("display", "none").eq($(this).index()).css("display", "block");
})