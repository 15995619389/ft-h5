import * as client from '../../modules/ApiClient'
import scroller from 'vue-scroller'
import Vue from 'vue'
import * as StatusService from '../../modules/StatusService'
import { Toast } from 'mint-ui'

function appendDone() {

}
new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        PrizeType: StatusService.PrizeType,
        PrizeStatus: StatusService.PrizeStatus,
        myprize: [],
        param: {
            pageindex: 1,
            pagesize: 10,
            status: '全部',
            type: -1
        },
        loading: false

    },
    methods: {
        Refresh: function () {
            islogin()
            var data = this.$data
            var self = this
            data.param.pageindex = 1
            data.loading = true
            client.Request({
                type: 'get',
                data: data.param,
                url: client.Api.myprize,
                success: function (result) {
                    data.myprize = result.Item1
                },
                complete: function (XMLHttpRequest, textStatus) {
                    data.loading = false
                    self.$refs.scroller.finishPullToRefresh()
                }
            })
        },
        Append: function (done) {
            islogin()
            var data = this.$data
            appendDone = done
            if (data.loading) {
                if (appendDone) { appendDone() }
                return
            }
            var nomore = false
            var self = this
            if (data.myprize.length) { data.param.pageindex += 1 } else { data.param.pageindex = 1 }
            data.loading = true
            client.Request({
                type: 'get',
                data: data.param,
                url: client.Api.myprize,
                success: function (result) {
                    if (result.Item1.length > 0) {
                        for (var i = 0; i < result.Item1.length; i++) { data.myprize.push(result.Item1[i]) }
                    } else { nomore = true }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error') { nomore = true }
                    data.loading = false
                    self.$refs.scroller.finishInfinite()
                    appendDone(nomore)
                }
            })
        },
        ChangeType: function (i) {
            var self = this
            var data = this.$data
            data.param.status = '全部'
            data.param.type = i
            self.$refs.scroller.triggerPullToRefresh()
        },
        ChangeStatus: function (s) {
            var self = this
            var data = this.$data
            data.param.type = -1
            data.param.status = s
            self.$refs.scroller.triggerPullToRefresh()
        },
        Get: function (id) {
            islogin()
            var self = this
            var pData = {
                Id: id
            }
            client.Request({
                type: 'post',
                data: pData,
                url: client.Api.getprize,
                success: function (result) {
                    if (result.Flag) { self.Refresh() }
                    Toast({ message: result.Message, duration: 1000 })
                },
                complete: function (XMLHttpRequest, textStatus) { }
            })
        },
        GetTelep: function (id) {
            islogin()
            var self = this
            var pData = {
                Id: id
            }
            client.Request({
                type: 'post',
                data: pData,
                url: client.Api.getprize,
                success: function (result) {
                    if (result.Flag) { 
                        self.Refresh();
                        Toast({ message: "奖品领取成功！我们会在3个工作日内与您核实信息并发放奖品，请您注意接听电话！", duration: 4000 });
                    }else {
                        Toast({ message: result.Message, duration: 1000 });
                    }
                },
                complete: function (XMLHttpRequest, textStatus) { }
            })
        },
        GetMatter: function (id) {
            window.location.href = '/act/getprize/' + id
        },
        LookTark: function (id) {
            if (id == null || id == undefined) return
            client.Request({
                type: 'post',
                url: '/act/lookdeduction?id=' + id,
                success: function (data) {
                    if (data.Flag) {
                        $('#DeductCode').text(data.UAPModel.TicketCode)
                        $('.rules').html(data.UAPModel.PrizeExplaine)
                        $('.securities').text(data.UAPModel.prizeName)
                        $('#ActName').text(data.UAPModel.ActName)
                        $('#money_count').text(data.UAPModel.Count)
                        $('#money_make').text(data.UAPModel.MakeTerm)
                        // $("#TimSetion").text("有效期" + CDER.FormatDate(data.UAPModel.TimSetionS, "yyyy年MM月dd日") + "至" + CDER.FormatDate(data.UAPModel.TimeSetionT, "yyyy年MM月dd日"));
                        $('#CreaTim').text(data.UAPModel.UAPCreateTime.substring(0, 10))
                        var $Popup = $('.popup-box')
                        $Popup.css({
                            display: 'block'
                        })
                    } else {
                        Toast({ message: data.Message, duration: 1000 })
                    }
                }
            })
        }
    }
})

function islogin() {
    if (!client.IsLogin) {
        window.location.href = '/passport/login?returnurl=' + window.location.href
    }
}
$(function () {
   
   
    Vue.filter('formatDate', function (value) {
        if (value != null && value != '') {
            return value.substring(0, 10)
        }
    })
    // 点击活动与状态切换
    $('.mui-content .prize_tab li').click(function () {
        $(this).addClass('text_color').siblings().removeClass('text_color')
        $('.mui-content .activtiy_box').css('display', 'none').eq($(this).index()).css('display', 'block')
        $('._v-content').css('margin-top', '130px')
        // $(".mui-content .activtiy_content").css("display", "none").eq($(this).index()).css("display", "block");
    })
    // 点击线上与线下活动切换

    $('.mui-content .activtiy_box .activtiy li').click(function () {
        $(this).addClass('text_color').siblings().removeClass('text_color')
        $('.mui-content .activtiy_box .state li').removeClass('text_color')
        // $(".online_teb").css("display", "none").eq($(this).index()).css("display", "block");
    })

    $('.mui-content .activtiy_box .state li').click(function () {
        $(this).addClass('text_color').siblings().removeClass('text_color')
        $('.mui-content .activtiy_box .activtiy li').removeClass('text_color')
        // $(".mui-content .activtiy_content .online_teb_box").css("display", "none").eq($(this).index()).css("display", "block");
    })
    $('.popup-box').click(function () {
        $(this).css('display', 'none')
    })
    $('._v-content').css('margin-top', '95px')
})
