import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import foot from '../../components/agent-nav/agent-nav.vue'

var r = window.location.href
var s = r.indexOf('?')
if (s == -1) { r = '/' } else { r = r.substring(s + 1, r.length) }
new Vue({
    el: '#mui-content',
    data: {
        updateresult: {}
    },
    components: {
        foot
    },
    created: function () {
        this.initData()
    },
    methods: {
        Update: function (id) {
            window.location.href = '/agent/writemessage/' + '?' + r
        },
        initData: function () {
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.updatefail,
                success: function (result) {
                    data.updateresult = result
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            })
        }
    }
})
$('#back').click(function () {
    var r = window.location.href
    if (r.indexOf('mybusiness') == -1) { window.location.href = '/' } else { window.location.href = '/mybusiness' }
})
