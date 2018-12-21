import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Mint from 'mint-ui'

Vue.use(Mint)
Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: {
        App
    }
})
