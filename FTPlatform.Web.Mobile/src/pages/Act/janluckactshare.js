import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl} from '../../modules/UrlService'
import * as storage from '../../modules/StorageService'
import {Popup,Toast} from 'mint-ui'
import share from '../../components/share/ShareV2.vue'
import preview from '../../components/img-preview.vue'

new Vue({
    el: '#mui-bar',
    components: {
        'popup': Popup,
        share,
        preview,
    },
    data: {
    },
    created: function () {
        
    },
    mounted:function(){
        var self=this
        this.$refs.share.Init({
            title: $("#shareTitle").val(),
            desc: $("#shareContent").val(),
        });
    },
    methods: {
        SharePage: function () {
            this.$refs.share.Show();
        },
        ShowPreview: function () {
            this.$refs.preview.Show('');
        },
    },
    filters: {
        FormatDate: function (value) {
            if (value != null) {
                return value.substr(0, 10)
            }
        }
    }
})