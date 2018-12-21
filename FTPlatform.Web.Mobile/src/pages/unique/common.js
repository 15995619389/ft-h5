import Vue from 'vue'
import rightsidebar from '../../components/RightSideBar.vue'
import share from '../../components/share/Share.vue'

new Vue({
    el: '#app',
    components: {
        rightsidebar,
        share
    },
    methods: {
        SharePage: function () {
            this.$refs.share.Show()
        }
    }
})
