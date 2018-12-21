import * as client from "../../modules/ApiClient";
import Vue from "vue";
import * as Storage from "../../modules/StorageService";
import {Toast} from "mint-ui";
//import foot from "../../components/mall-nav/mall-nav.vue"

var vm = new Vue({
    el: "#vuediv",
    data: {
        odfrom: [],
        modity: [],
        hotSearchKeys: [
            { name: '移动硬盘', value: '移动硬盘' },
            { name: '电子书阅读器', value: '电子书阅读器' },
            { name: '小米新款移动电源', value: '小米新款移动电源' },
            { name: '神州十号飞船模型', value: '神州十号飞船模型' },
            { name: '三网通（100元话费）', value: '三网通 100元话费' },
            { name: '三网通（50元话费）', value: '三网通 50元话费' },
        ],
        advmodels:[],
    },
    methods: {
        Reresh: function () {
            var _owndata = this;
            //layer.msg("正在加载...", { time: 200000, shade: 0.2 })
            client.Request({
                type: "get",
                url: client.Api.mallindex,
                success: function (result) {
                    _owndata.odfrom = result.getOrderFrom;
                    _owndata.modity = result.getModitys;
                    _owndata.advmodels=result.advModels;
                    //layer.closeAll('dialog');
                },
                complete: function () {
                }
            });
        },
        hrefDetail: function (Id) {
            location.href = "/mall/detail/" + Id;
        },
        searchhotkey: function (key) {
            ListUrl(key);
        }
    },
    created: function () {
        this.Reresh();
    }
});

$("#onSersh").click(function () {
    var title = $("#txt_searchbar").val();
    if (title != null && title != "" && title != 'undefined') {
        ListUrl(title);
    }
})
$(document).keyup(function (event) {
    var title = $("#txt_searchbar").val();
    if (event.keyCode == 13 && title != null && title != "" && title != 'undefined') {
        ListUrl(title);
    }
});

//列表滚动---------------页面原来js
var doscroll = function () {
    var oUl = $('.right-text ul');
    var liFirst = oUl.find('li:first');
    var height = liFirst.height();
    liFirst.animate({
        marginTop: -height + 'px'
    }, 1000, function () {
        liFirst.css('marginTop', 0).appendTo(oUl);
    });
};
setInterval(function () { doscroll() }, 2000);
var onOff1 = true;
$(".search_box").click(function () {
    $(".shop-search").addClass("search-Zindex");
    $(".body_content").addClass("content-display");
    //$(".body").addClass("body-overfloow");
    $(".ft-tab").addClass("content-display");
    //$(".under-gird").css("display","none")
    var pis = $(".under-gird").css("display", "block")
    if (onOff1) {
        pis.css("display", "none");
        $("body").off("touchmove");
        onOff1 == false;
    }
})
$(".shop-search .mui-pull-left").click(function () {
    $(".shop-search").removeClass("search-Zindex")
    $(".body_content").removeClass("content-display");
    //$("body").removeClass("body-overflow");
    $(".ft-tab").removeClass("content-display");
})
$(".del-icon").click(function () {
    $(".delete-item").css({ "display": "block" })
})
$(".delete-btngroup a").click(function () {
    if ($(this).index() == 0) {//清除记录
        $(".recent-box").hide();
        Storage.Set('the_cookie', "", { path: '/' });
        $(".delete-item").hide();
        Toast({message:"记录清除成功！",duration:1000}); 
    } else if ($(this).index() == 1) {
        $(".delete-item").hide();
    }
})
/*---点击商城说明，防止页面内容上下滑动----*/
$(".right-adt a").click(function () {
    var pis = document.querySelector(".under-gird");
    if (pis.style.display == "block") {
        $("body").off("touchmove");
    } else {
        $("body").on("touchmove", function (e) {
            e.preventDefault();
        });
    }
})

//滚动结束-------------

var thecookies = Storage.Get('the_cookie');
if (thecookies != null && thecookies != "" && thecookies != undefined) {
    $(".recent-list").html("");
    var cookiest = thecookies.split('‖');
    if (cookiest.length - 1 <= 5) {
        for (var i = 0; i < cookiest.length - 1; i++) {
            AddRecord(cookiest[i]);
        }
    } else {
        for (var i = 0; i < 5; i++) {
            AddRecord(cookiest[i]);
        }
    }
    $(".recent-box").show();
}
function AddRecord(value) {
    var htmlprent = $(".recent-list");
    var html = "<ul> <span><a href=\"javascript:\" onclick=\"ListUrl('" + value + "')\" >" + value + "</a></span></ul>";
    htmlprent.append(html);
}
function ListUrl(title) {
    var thecookie = Storage.Get('the_cookie');
    if (thecookie != null && thecookie != "" && thecookie != undefined) {
        if (title.trim() != "" && title.trim() != null) {
            thecookie = thecookie.replace(title + "‖", "");
            thecookie = title + "‖" + thecookie;
        }
    } else {
        thecookie = title.trim() + "‖";
    }
    Storage.Set('the_cookie', thecookie,{ path: '/' });
    location.href = "/mall/List?title=" + escape(title);
}