import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl } from '../../modules/UrlService'
import { Popup, Toast } from 'mint-ui'
import scroller from "vue-scroller";
import rightsidebar from "../../components/RightSideBar.vue";

var vm = new Vue({
    el: '#container',
    components: {
        popup: Popup,
        scroller: scroller.Scroller,
        rightsidebar
    },
    data: {
        article: { ArticleImgList: [], HighMerchant: null },
        merchantcritique:[],
        critiqueparam:{pageIndex: 1},
        critique:[],
        tab:0,
        PopupMessage: '',
        PopupUrl: '',
        IsPopupVisiable: false,
        isSub:true
    },
    created: function () {
        if (!GetIdFromUrl()) {
            window.location.href = '/higharticlelist'
            return
        }
        this.Init()
    },
    methods: {
        Init: function () {
            var _self = this
            client.Request({
                type: 'GET',
                url: '/highs/articleshow/' + GetIdFromUrl(),
                success: function (res) {
                    if (res.Code == '200') {
                        _self.$data.article = res.Data
                        $(res.Data.ArticleImgList).each(function(i,o){
                            var splitImg=o.ImgPath.split(".")
                            o.ImgPath=splitImg[0]+"_340_340."+splitImg[1]
                        });

                        for (var i = 0; i < _self.$data.article.HighMerchant.ScoreNum; i++) {
                            _self.$data.merchantcritique.push(i);
                        }
                    }else if(res.Code=='201'){
                        window.location.href='/higharticlelist'
                    }
                },
                complete: function (result) {
                    window.setTimeout(function () {
                        var gallery = mui('.mui-slider');
                        if (gallery && gallery.length > 0) {
                            gallery.slider({
                                interval: 2500 //自动轮播周期，若为0则不自动播放，默认为0；
                            });
                        }
                    }, 500);
                }
            })

            _self.critiquesearch();
        },
        critiquesearch:function(fn){
            var _self = this
            client.Request({
                type: 'GET',
                url:"/highs/articlecritique/"+GetIdFromUrl(),
                data:_self.$data.critiqueparam,
                success: function (res) {
                    if (res&&res.Code == '200') {
                        if(typeof fn == "function"){
                            fn(res);
                        }else{
                            _self.$data.critique=res.Data;
                        }
                    }
                }
            })
        },
        TabChoose:function(index){
            this.$data.tab=index;
            if(index == 0){
                $(".mui-content").css("background","#fff")
                $('html,body').animate({ // $('html,body')兼容问题body属于chrome
                    scrollTop: 0
                })
            }else if(index == 1 ){
                $(".mui-content").css("background","#fff")
                var $loutitop = $('.louti').eq(index).offset().top;// 获取每个楼梯的offsetTop值
                var h = $("#louTi").height();
                if($loutitop == 0){
                    $('html,body').animate({ 
                        scrollTop: $loutitop+h
                    })
                }else{
                    $('html,body').animate({ 
                        scrollTop: h
                    })
                }
            }else{
                $(".mui-content").css("background","#efeff4");
                $('html,body').animate({ 
                    scrollTop: 0
                })
            }

        },
        Append:function(bone){
            var _self = this;
            _self.$data.critiqueparam.pageIndex++;
            setTimeout(function () {
                _self.critiquesearch(function(result){
                    var ismore = true;
                    for (var i = 0; i < result.Data.length; i++) {
                        _self.$data.critique.push(result.Data[i])
                    }
                    if (result.data && result.data.length > 0){
                        ismore = false;
                    }
                    bone(ismore);
                })
            },500);
        },
        Refresh:function(bone){
            bone(false);
        },
        MoreProduct:function(){
            window.location.href = '/higharticlelist'
        },
        Follow:function(){
            var _self=this;
            if(!client.IsLogin()){
                _self.PopupLogin()
                return
            }
            if(!_self.isSub){
                return
            }
            _self.isSub=false
            client.Request({
                type: 'POST',
                url:"/highs/articlefollow/"+GetIdFromUrl(),
                success: function (res) {
                    if(res.err_code=="0000"){
                        _self.$data.article.IsConcerned="True";
                    }else if(res.err_code=="1100"){
                        _self.$data.article.IsConcerned="False";
                    }
                    Toast({ message:res.err_msg, duration: 1000 })
                },
                complete: function () {
                    _self.isSub=true
                }
            })   
        },
        PopupRedirect: function () {
            window.location.href = this.$data.PopupUrl
        },
        HidePopup: function () {
            this.$data.IsPopupVisiable = false
        },
        PopupLogin: function () {
            this.$data.PopupMessage = '登录后继续，是否登录？'
            this.$data.PopupUrl =client.LoginReturn(window.location.href)
            this.$data.IsPopupVisiable = true
        },
        Cousulting:function(productId){
            var self=this
            if(!client.IsLogin()){
                this.PopupLogin()
                return
            }
            var user=client.GetCurrentUser()
            if(user.Id==self.$data.article.HighMerchant.UserId){
                Toast({ message:"无法咨询自己的商品", duration: 1000 })
                return
            }
            window.location.href = "/higharticle/consulting/"+productId
        },
        OrderEnter:function(){
            var self=this
            if(!client.IsLogin()){
                this.PopupLogin()
                return
            }
            var user=client.GetCurrentUser()
            if(user.Id==self.$data.article.HighMerchant.UserId){
                Toast({ message:"无法购买自己的商品", duration: 1000 })
                return
            }
            window.location.href = "/higharticle/orderenter/"+GetIdFromUrl()
        }
    }
})
