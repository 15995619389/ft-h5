import Vue from "vue";
import foot_item from "../../components/foot-nav-sm/foot-nav-high.vue";
import searchbar from "../../components/searchbar/SearchBar.vue";
import * as client from "../../modules/ApiClient";
import { Popup } from 'mint-ui'
import rightsidebar from "../../components/RightSideBar.vue";

var vm = new Vue({
    el:'#container',
    components: {
        searchbar:searchbar,
        foot_item,
        popup: Popup,
        rightsidebar
    },
    data:{
        banners:[],
        highdetail:[],
        highSpread:[],
        ismerchant:false,
        PopupMessage: '',
        PopupUrl: '',
        IsPopupVisiable: false
    },
    created(){ 
        var self  = this;
        this.Reresh();
    },
    methods:{
        Reresh:function(){
            var self = this;
            client.Request({
                url:'/highs/articlehome',
                type:'GET',
                success:function(result){
                    if(result.Code == "200" ){
                        self.$data.banners = result.Data.banners
                        self.$data.highdetail = result.Data.articlehome
                        self.$data.highSpread=result.Data.spreadlist
                        self.$data.ismerchant=result.Data.ismerchant
                    }
                },
                complete: function () {
                }
            });
        },
        ClickUrl:function(type){
            var self=this;
            if (!client.IsLogin()) {
                self.PopupLogin()
                return;
            }
            if(type==1){                                //商户入驻
                if(!self.$data.ismerchant){
                    window.location.href="/seller/settled"
                }else{
                    window.location.href="/seller"
                }
            }
            if(type==3){
                window.location.href="/buyer/order"    //我的订单
            }
            if(type==2||type==4){              //2.发布产品4.卖家首页
                if(!self.$data.ismerchant){
                    self.PopupMerchantSet()
                }else{
                    if(type==2){
                        window.location.href="/seller/publishgood"
                    }
                    else if(type==4){
                        window.location.href="/seller"
                    }
                }
            }
        }, 
        PopupRedirect: function () {
            window.location.href = this.$data.PopupUrl
        },
        HidePopup: function () {
            this.$data.IsPopupVisiable = false
        },
        PopupLogin: function () {
            this.$data.PopupMessage = '登录后继续，是否登录？'
            this.$data.PopupUrl =client.LoginReturn(location.href)
            this.$data.IsPopupVisiable = true
        },
        PopupMerchantSet:function(){
            this.$data.PopupMessage = '您还不是商家用户，是否申请成为商家？'
            this.$data.PopupUrl ="/seller/settled"
            this.$data.IsPopupVisiable = true
        }
    },
})