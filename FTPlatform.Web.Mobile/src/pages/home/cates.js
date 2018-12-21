import Vue from "vue";
import client from "../../modules/ApiClient";
import * as StorageService from "../../modules/StorageService";

var localdata = StorageService.Get("navs_All") || {};

var vm = new Vue({
    el: '.mui-content',
    data: {
        navs: localdata || {},
    },
    methods: {
        InitData: function () {
            var data = this.$data;
            client.Request({
                url:'/configs/getnavs',
                success: function (result) {
                    data.navs = result;
                    StorageService.Set("navs_All", result);
                }
            });
        }
    }
});

vm.InitData();
