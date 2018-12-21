import * as client from '../../modules/ApiClient'
import scroller from 'vue-scroller'
import Vue from 'vue'
import foot from '../../components/agent-nav/agent-nav.vue'
import { Indicator } from 'mint-ui'

Vue.filter('formatDate', function (value) {
    if (value != null && value != '') {
        return value.substring(0, 10)
    }
})
Vue.filter('u', function (val) {
    if (val == 1) { return '个人' } else { return '机构' }
})
Vue.filter('AgentLevel', function (val) {
    if (val == 2) { return '中级技术合伙人' } else { return '初级技术合伙人' }
})
new Vue({
    el: '#content',
    components: {
        scroller: scroller.Scroller,
        foot
    },
    data: {
        agent: {},
        friends: {},
        Frelease: {},
        Fabut: {}
    },
    created: function () {
        this.initData()
    },
    methods: {
        initData: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            Indicator.open({ text: '加载中' })
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.memberindex,
                success: function (result) {
                    data.agent = result.agent
                    data.friends = result.friends
                    data.Frelease = result.frelease
                    data.Fabut = result.fabut
                },
                complete: function (XMLHttpRequest, textStatus) {
                    Indicator.close()
                }
            })
        },
        Detail: function (id) {
            window.location.href = '/demand/detail/' + id
        }

    }
})

$(function () {
    if (!client.IsLogin()) {
        window.location.href = '/passport/login?returnurl=' + window.location.href
        return
    }
    var r = window.location.href
    var s = r.indexOf('?')
    if (s == -1) { r = '/' } else { r = r.substring(s + 1, r.length) }
    $('#back').click(function () {
        if (r.indexOf('mybusiness') == -1) { window.location.href = '/' } else { window.location.href = '/mybusiness' }
    })
    $('#index').click(function () {
        window.location.href = '/agent/index?' + r
    })
})
