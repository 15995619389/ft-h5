import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import * as StatusService from '../../modules/StatusService'
import { Toast } from 'mint-ui'
import { GetIdFromUrl } from '../../modules/UrlService'

var vm = new Vue({
    el: '.mui-content',
    data: {
        ActNewModes:[],
    },
    created: function () {
        this.Init();
    },
    methods: {
        Init:function(){
            var _data=this;
            client.Request({
                type: 'post',
                url: "/activities/initdataorderbydescending",
                success: function (data) {
                    _data.ActNewModes=data;
                },
                complete: function () {
                }
            })
        },
    }
})