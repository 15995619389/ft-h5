import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";

function appendDone() {
    return;
}
var MyAdvie = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        param: { pageindex: 1, pagesize: 10 },
        advise: [],
        loading: false
    },
    methods: {      
        Refresh: function (done) {
            var data = this.$data;
            var self = this;
            data.param.pageindex = 1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.myadvise,
                success: function (result) {
                        data.advise=result.Entitys;
                },
                complete: function (XMLHttpRequest, textStatus) {                 
                    data.loading = false;
                    self.$refs.scroller.finishPullToRefresh();
                }
            });
            if(done)
                done();
        },
        Append: function (done) {
            appendDone = done;
            var data = this.$data;
            if (data.loading) {
                if (appendDone)
                    appendDone();
                return;
            }
            var self = this;
            var nomore = false;
            if(data.advise.length)
                data.param.pageindex += 1; 
            else 
                data.param.pageindex=1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.myadvise,
                success: function (result) {
                    if (result.Entitys.length == 0)
                        nomore = true;
                    for (var i = 0; i < result.Entitys.length; i++)
                        data.advise.push(result.Entitys[i]);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        nomore = true;
                    data.loading = false;
                    self.$refs.scroller.finishInfinite(2);
                    appendDone(nomore)
                }
            });
        },
        Detail:function(id){
            location.href = "/techshare/advisorydetails/" + id;
        }
    }

})
$(function () {
    Vue.filter('formatDate', function (value) {
        if (value != null && value != "") {
            return value.substring(0, 10);
        }
    });
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=%2Ftechshare%2Ftechshareconsult';
        return;
    }
    Vue.filter('t', function (val) {
        return val.substring(0, 10);
    })

})