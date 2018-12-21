/* ……数据绑定…… */
import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import foot from '../../components/agent-nav/agent-nav.vue'
import scroller from 'vue-scroller'

function appendDone() {

}
Vue.filter('formatDate', function (value) {
    if (value != null && value != '') {
        return value.substring(0, 10)
    }
})

Vue.filter('formatStatus',function(value){
    if(value!=null&&value!=''){
        if(Number(value)){
            return "邀请人注册"
        }else{
            return value
        }
    }else{
        return ""
    }
})

new Vue({
    el: '.mui-off-canvas-wrap',
    data: {
        param: { pageindex: 1, pagesize: 15, startTime: null, endTime: null, scoreSourceType: 0, Fid: '' },
        reward: [],
        loading: false,
        Score: 0, // u.Score
        nomore: false
    },
    components: {
        foot,
        scroller: scroller.Scroller
    },
    methods: {
        Refresh: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            var data = this.$data
            var self = this
            data.param.pageindex = 1
            data.loading = true
            client.Request({
                type: 'get',
                data: data.param,
                url: client.Api.queryreward,
                success: function (result) {
                    data.Score = result.score
                    data.reward = result.agentreward
                },
                complete: function (XMLHttpRequest, textStatus) {
                    self.$refs.scroller.finishPullToRefresh()
                    data.loading = false
                }
            })
        },
        Append: function (done) {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            appendDone = done
            var data = this.$data
            if (data.loading) {
                if (appendDone) {
                    appendDone()
                }
                return
            }
            var self = this
            if (data.reward.length) { data.param.pageindex += 1 } else { data.param.pageindex = 1 }
            data.loading = true
            var nomore = false
            client.Request({
                type: 'get',
                data: data.param,
                url: client.Api.queryreward,
                success: function (result) {
                    data.Score = result.score
                    if (result.agentreward.length == 0) {
                        nomore = true
                    } else {
                        for (var i = 0; i < result.agentreward.length; i++) { data.reward.push(result.agentreward[i]) }
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error') { nomore = true }
                    data.loading = false
                    self.$refs.scroller.finishInfinite(2)
                    appendDone(nomore)
                }
            })
        },
        submit: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            var data = this.$data
            data.param.startTime = $('#data').val()
            data.param.endTime = $('#data1').val()
            data.param.scoreSourceType = $('.cur').find('input').val()
            data.param.Fid = $('.idinput').val()
            this.$refs.scroller.triggerPullToRefresh()
            $('#offCanvasSide').attr('style', '')
            $('.mui-inner-wrap').attr('style', '')
            // client.Request({
            //    type: "post",
            //    url: client.Api.queryreward + '?startTime=' + $('#data').val() + '&endTime=' + $('#data1').val() + '&scoreSourceType=' + $(".cur").find("input").val() + '&Fid=' + $(".idinput").val(),
            //    success: function (result) {
            //        data.reward = result.DataSource;
            //        $('#offCanvasSide').attr("style", "");
            //        $(".mui-inner-wrap").attr("style", "");
            //        StorageService.Set("myreward", result);
            //    }, complete: function (XMLHttpRequest, textStatus) {
            //    }
            // });
        },
        Reset: function () {
            $('#data').val('')
            $('#data1').val('')
            $('.idinput').val('')
            $('#all').addClass('cur').parent().siblings().find('label').removeClass('cur')
            var param = this.$data.param
            param.startTime = null
            param.endTime = null
            param.scoreSourceType = 0
            param.Fid = ''
        },
        back: function () {
            var r = window.location.href
            if (r.indexOf('mybusiness') == -1) { window.location.href = '/' } else { window.location.href = '/mybusiness' }
        },
        turn: function (opts) {
            var r = window.location.href
            var s = r.indexOf('?')
            if (s == -1) { r = '/' } else { r = r.substring(s + 1, r.length) }
            window.location.href = '/agent/' + opts + '?' + r
        }
    }
})

$(function () {
    Vue.filter('st', function (val) {
        switch (val) {
            case 0:
                return '未知'
            case 1:
                return '自己注册'
            case 2:
                return '邀请人注册'
            case 3:
                return '发布有效需求'
            case 4:
                return '有效解决需求'
            case 5:
                return '智友发布有效需求'
            case 6:
                return '智友有效解决需求'
            case 7:
                return '活动赠送'
            case 8:
                return '充值'
            case 9:
                return '评价需求'
            case 10:
                return '审核通过的专家'
            case 11:
                return '审核通过的签约专家'
            case 12:
                return '购买商品返还'
            case 13:
                return '发布有效技术推荐'
            case 14:
            case 15:
            case 16:
            case 2025:
                return '首次提交或保存技术推荐'
            case 18:
                return 'h5发布有效需求'
            case 19:
                return 'h5申请有效供方'
            case 20:
                return 'h5发布有效技术推荐'
            default:
                return val
        }
    })

    $('.scrol-top a').click(function () {
        $('input[type=date]').blur()
    })
    $('ul.list li label').click(function () {
        $(this).addClass('cur').parent().siblings().find('label').removeClass('cur')
    })
    $('.mui-scroll #offside').click(function () {
        $('#offCanvasSide').attr('style', '')
        $('.mui-inner-wrap').attr('style', '')
    })
    $('.ft-tab a').removeClass('mui-active')
    $('#reward').addClass('mui-active')
    $('.mui-pull-top-pocket').css('top', '0px')
})
