import Vue from 'vue'
import foot from '../../components/agent-nav/agent-nav.vue'

new Vue({
    el: '.mui-content',
    components: {
        foot
    }
})
$('#back').click(function () {
    var r = window.location.href
    if (r.indexOf('mybusiness') == -1) { window.location.href = '/' } else { window.location.href = '/mybusiness' }
})
