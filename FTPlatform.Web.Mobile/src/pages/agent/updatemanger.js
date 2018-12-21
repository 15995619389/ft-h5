import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import foot from '../../components/agent-nav/agent-nav.vue'
import { Indicator } from 'mint-ui'

var r = window.location.href
var s = r.indexOf('?')
if (s == -1) { r = '/' } else { r = r.substring(s + 1, r.length) }
var um = new Vue({
    el: '#cont',
    data: {
        AgentCertificate: {},
        demand: {},
        referee: 0,
        num: {},
        agent: {},
        complete: 0
    },
    components: {
        foot
    },
    methods: {
        WisdomSink: function () {
            client.Request({
                type: 'get',
                url: '/user/complete',
                success: function (res) {
                    if (res.err_code == '401') {
                        window.location.href = '/passport/login?returnurl=' + window.location.href
                    } else if (res.data == 0) {
                        $('#mask').css({
                            display: 'block',
                            height: $('html').height()
                        })
                        $('.mint-popup').css('display', 'block')
                    } else {
                        window.location.href = '/agent/WisdomSink' + '?' + r
                    }
                }
            })
        },
        Publish: function () {
            client.Request({
                type: 'get',
                url: '/user/complete',
                success: function (res) {
                    if (res.err_code == '401') {
                        window.location.href = '/passport/login?returnurl=' + window.location.href
                    } else if (res.data == 0) {
                        $('#mask').css({
                            display: 'block',
                            height: $('html').height()
                        })
                        $('.mint-popup').css('display', 'block')
                    } else {
                        window.location.href = '/demand/publish'
                    }
                }
            })
        },
        initData: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            Indicator.open({ text: '加载中' })
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.updatemanger,
                success: function (result) {
                    data.AgentCertificate = result.AgentCertificate
                    data.referee = result.referee
                    data.demand = result.demand
                    data.num = result.num
                    data.complete = result.complete
                    data.agent = result.agent
                    if (result.agent.AuditState == 0 && result.agent.Id > 0) { window.location.href = '/agent/submited' + '?' + r }
                    if (result.agent.AuditState == 2 && result.agent.Id > 0) { window.location.href = '/agent/submitfail' + '?' + r }
                    if (data.num == 1) { $('.register_now button').removeAttr('disabled') }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    Indicator.close()
                }
            })
        },
        look_img: function () {
            layer.open({
                type: 1,
                title: '证书',
                area: ['100%', '100%'],
                content: $('#showimg'), // 捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                end: function () {
                    $('#showimg').css('display', 'none')
                }
            })
        }
    }
})

$(function () {
    if (!client.IsLogin()) {
        window.location.href = '/passport/login?returnurl=' + window.location.href
        return
    }
    um.initData()
    $(document).on('change', '#fileField', function () {
        if (!client.IsLogin()) {
            window.location.href = '/passport/login?returnurl=' + window.location.href
            return
        }
        layer.open({
            type: 1,
            title: '上传证书',
            area: ['100%', '100%'],
            btn: ['提交', '取消'],
            content: $('#crop-avatar'), // 捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            yes: function (index, layero) {
                var t = $('.conmit').click()
                if (t) {
                    um.initData()
                    layer.close(index)
                }
            },
            btn2: function () {
                $('.cancel').click()
            },
            end: function (index, layero) {
                $('.cancel').click()
            }

        })
    })
    $('.disappear').on('click', function () {
        $('.mint-popup,#mask').css({ 'display': 'none' })
    })
    $('#back').click(function () {
        var r = window.location.href
        if (r.indexOf('mybusiness') == -1) { window.location.href = '/' } else { window.location.href = '/mybusiness' }
    })
})
