import Vue from "vue";
import * as client from "../../modules/ApiClient";
import { GetIdFromUrl } from "../../modules/UrlService";


var vm=new Vue({
    el: '.mui-content',
    data: {
        details: {},
    },
    created: function () {
        this.initData();
    },
    methods: {
        initData: function () {
            if (!client.GetCurrentUser()) {
                window.location.href =client.LoginReturn(location.href);
                return;
            }

            var data = this.$data;
         
            client.Request({
                type: "post",
                url: client.Api.advisedetail + '?id=' + GetIdFromUrl(),
                success: function (result) {
                    data.details = result;
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            });
        },
    },
    filters:client.Filters
});