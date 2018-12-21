import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import * as StatusService from "../../modules/StatusService";
import {Toast} from "mint-ui";

//数据绑定
function appendDone() {
    return;
}
var MD = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        param: {
            pageindex: 1,
            Status: 0,
            pagesize: 10
        },
        mybutt: [],
        ExpertStatus: StatusService.ExpertStatus,
        DemandSolveStatus: StatusService.DemandSolveStatus,
        InputBudget: ["<1万", "1~10万", "10~50万", "50~200万", ">200万", ],
        loading: false
    },
    methods: {
        Refresh: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=' + window.location.href;
                return;
            }
            this.$refs.scroller.scrollTo(0, 0);
            var self = this;
            var data = self.$data;
            data.loading = true;
            data.param.pageindex = 1;
            data.mybutt = [];
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.expersolutiondemand,
                success: function (result) {

                    data.mybutt = result;
                },
                complete: function (XMLHttpRequest, textStatus) {
                    data.loading = false;
                    self.clear();
                    self.$refs.scroller.finishPullToRefresh();
                }
            });
        },
        clear: function () {
            setTimeout("var s = $('.title_footer');$.each(s,function(i,item){if($(item).find('button').length<=0) item.remove();})", 250);
        },
        Append: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=' + window.location.href;
                return;
            }
            appendDone = done;
            var data = this.$data;
            if (data.loading) {
                if (appendDone) {
                    appendDone();
                }
                return;
            }
            var nomore = false;
            var self = this;
            if (data.mybutt.length)
                data.param.pageindex += 1;
            else
                data.param.pageindex = 1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.expersolutiondemand,
                success: function (result) {
                    if (result.length == 0)
                        nomore = true;
                    for (var i = 0; i < result.length; i++)
                        data.mybutt.push(result[i]);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        nomore = true;
                    data.loading = false;
                    self.clear();
                    self.$refs.scroller.finishInfinite(2);
                    appendDone(nomore);
                }
            });
        },
        show: function (i) {
            var data = this.$data;
            data.param.Status = i;
            this.$refs.scroller.triggerPullToRefresh();

        },

        SumbitProjectExit: function () {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.submitexit + '?id=' + $('#id').val(),
                success: function (result) {
                    if (result && result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $('#mask,.popup').css('display', 'none');
                }
            })
        },

        GetPayMessage: function () {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.getpay + '?id=' + $('#id').val(),
                success: function (result) {
                    self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $('#mask,.popup').css('display', 'none');
                }
            })
        },
        SumbitProjectOver: function () {

            var self = this;
            client.Request({
                type: "post",
                url: client.Api.submitover + '?id=' + $('#id').val(),
                success: function (result) {
                    if (result && result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $('#mask,.popup').css('display', 'none');
                }
            })
        },
        CritiqueDemandUser: function (id) {

            location.href = "/expert/CritiqueDemandUser/" + id;
        },
        OptTermY: function () {

            var self = this;
            client.Request({
                type: "post",
                url: client.Api.opttermination + '?type=1' + '&id=' + $('#id').val(),
                success: function (result) {
                    if (result && result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $('#mask,.popup').css('display', 'none');
                }
            })
        },
        OptTermN: function () {

            var self = this;
            client.Request({
                type: "post",
                url: client.Api.opttermination + '?type=2' + '&id=' + $('#id').val(),
                success: function (result) {
                    if (result && result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $('#mask,.popup').css('display', 'none');
                }
            })
        },
        OpenM: function (val, id) {
            $('#id').val(id);
            $('#mask').css({
                display: 'block',
                height: window.screen.height
            })
            var $Popup = $(val);
            $Popup.css({
                left: ($('body').width() - $Popup.width()) / 2 + 'px',
                top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
                display: 'block'
            })
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
        },
        Detail: function (id) {
            location.href = '/demand/detail/' + id;
        },

    }

});
$(function () {
    Vue.filter('formatDate', function (value) {
        if (value != null && value != "") {
            return value.substring(0, 10);
        }
    });
    $(".disappear").on("click", function () {
        $('#mask,.popup').css('display', 'none');
        $("body").off("touchmove");

    })
    var show = false;
    $(".content_nav li").on("click", function () {
        $(".mui-content .allProject").hide();
        $(".mui-content .allProject li").removeClass("text_color");
        $(this).addClass("text_color").siblings().removeClass("text_color");
        MD.show($(this).attr("value"));
        if (show)
            show = !show;
        $('._v-content').css("margin-top", "87px");
    })
    $(".content_nav .right_iocn").on("click", function () {
        $(".mui-content .content_nav li").removeClass("text_color");
        if (!show) {
            $(".mui-content .allProject").css("display", "block");
        } else {
            $(".mui-content .allProject").css("display", "none");
        }
        show = !show
        if (show)
            $('._v-content').css("margin-top", "130px");
        else
            $('._v-content').css("margin-top", "87px");

    })
    $(".allProject li").on("click", function () {
        $(".mui-content .content_nav li").removeClass("text_color");
        $(this).addClass("text_color").siblings().removeClass("text_color");
        MD.show($(this).attr("value"));
    })
    $('._v-content').css("margin-top", "90px");
})