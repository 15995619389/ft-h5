import Vue from "vue";
import * as StorageService from "../../modules/StorageService";
import client from "../../modules/ApiClient";
import searchbar from "../../components/searchbar/SearchBar.vue";
import foot from "../../components/foot-nav/foot-nav.vue";
import rightsidebar from "../../components/RightSideBar.vue";

var localdata = StorageService.Get("homeindex") || {};
var localadv = StorageService.Get("homeadv") || [];
var localnav = StorageService.Get("homenav") || [];
localdata.experts = localdata.experts || {};

var vm = new Vue({
    el: '#container',
    components: {
        searchbar,
        foot,
        rightsidebar
    },
    data: {
        banners: localdata.banners || [],
        advs: localadv || [],
        navs: localnav || [],
        news: localdata.news || [],
        starexpert: localdata.experts.StarExpert || [],
        recommendexpert: localdata.experts.recommendexpert || [],
        proforg: localdata.experts.StarDept || [],
        unsolvedemands: localdata.demands || [],
        populartechshare: localdata.techs || [],
        InputBudget: ["面议", "<1万", "1~10万", "10~50万", "50~200万", ">200万"]
    },
    created: function () {
        var self = this;
        self.InitData();
    },
    mounted: function () {
        this.$refs.search.Init(true);
    },
    methods: {
        InitData: function () {
            if (client.IsLogin()) {
                $(".foot_longin ul").children("li").eq(0).hide();
                $(".foot_longin ul").children("li").eq(1).hide();
                $(".foot_longin ul").children("li").eq(2).css({
                    "margin-left": "35%"
                });
            }
            var data = this.$data;
            client.Request({
                type: "post",
                url: client.Api.homeindex,
                success: function (result) {
                    data.news = result.news || [];
                    result.experts = result.experts || {};
                    data.starexpert = result.experts.StarExpert || [];
                    data.recommendexpert = result.experts.recommendexpert || [];
                    data.proforg = result.experts.StarDept || [];
                    data.unsolvedemands = result.demands || [];
                    data.populartechshare = result.techs || [];
                    StorageService.Set("homeindex", result);

                },
                complete: function (XMLHttpRequest, textStatus) {

                }
            });

            client.Request({
                url: client.Api.getbanner,
                success: function (result) {
                    data.banners = result.banners || [];
                    data.advs = result.advs || [];
                    StorageService.Set("homeadv", result);

                },
                complete: function (result) {
                    //var bannerObj = JSON.parse(result.responseText);
                    //if (bannerObj.banners.length > 0) {
                    // 动态html 渲染轮播，需等待DOM加载完毕后调用轮播插件
                    window.setTimeout(function () {
                        var gallery = mui('.mui-slider');
                        if (gallery && gallery.length > 0) {
                            gallery.slider({
                                interval: 2500 //自动轮播周期，若为0则不自动播放，默认为0；
                            });
                        }
                    }, 2500);
                    //}
                }
            });

            client.Request({
                url: client.Api.getnavforindex,
                success: function (result) {
                    data.navs = result || [];
                    StorageService.Set("homenav", result);
                },
                complete: function (result) {

                }
            });
        },
        Add: $.proxy(function (id) {
            console.log(id);
        }, this),
        Edetail: $.proxy(function (id) {
            location.href = '/expert/detail/' + id;
        }, this),
        Ddetail: $.proxy(function (id) {
            location.href = '/demand/detail/' + id;
        }, this),
        Tdetail: $.proxy(function (id) {
            location.href = '/techshare/detail/' + id;
        }, this),
        Nav: $.proxy(function (url) {
            location.href = UrlService.Urls.Unique.List + url;
        }, this),
        NewsDetail: $.proxy(function (id) {
            location.href = "/news/detail/" + id;
        }),
        NewsList: $.proxy(function () {
            window.location.href = "/news/index";
        }, this)
    },
    filters: client.Filters
});

var doscroll = function () {
    var oUl = $('.news_info ul');
    var liFirst = oUl.find('li:first');
    var height = liFirst.height();
    liFirst.animate({
        marginTop: -height + 'px'
    }, 1000, function () {
        liFirst.css('marginTop', 0).appendTo(oUl);
    });
};
setInterval(function () {
    doscroll()
}, 2000);
/*---首页滑动后，点击搜索出现的问题----*/
$('.search_box').on("click", function () {
    $(window).scrollTop(0);
    return false;
});