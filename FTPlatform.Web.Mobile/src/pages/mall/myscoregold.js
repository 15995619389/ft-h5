import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import FilterService from "../../modules/FilterService.js";
import foot from "../../components/mall-nav/mall-nav.vue"

Vue.filter("type", function (val) {
    if (val <= 0)
        return "-";
    else
        return "+";
});

function appendDone() {
    return;
}
var Score = new Vue({
    el: '.mui-content',
    data: {
        param:{pagaindex:1,pagesize:10},
        record:[],
        score: 0,
        isloading:false,
        nomore:false
    },
    created:function(){
        this.Refresh();
    },
    components:{
        scroller: scroller.Scroller,
        foot,
    },
    methods: {
        Refresh: function () {
            if (! client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Ffeedback%2Fmyfeedback';
                return;
            }
            var data = this.$data;
            if (data.loading)
                return;
            var self = this;
            data.param.pageindex = 1;
            data.loading = true;
             client.Request({
                type: "get",
                data: data.param,
                url:  client.Api.scorerecord,
                success: function (result) {
                    data.record = result.Rscore;
                    data.score = result.score;
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        data.nomore = true;
                    data.loading = false;
                    self.$refs.scroller.finishPullToRefresh();
                }
            })

        },
        Append: function (done) {
            appendDone = done;
            var data = this.$data;
            var self = this;
            if (data.loading) {
                if (appendDone)
                    appendDone();
                return;
            }            
            if (data.record.length)
                data.param.pageindex += 1;
            else
                data.param.pageindex = 1;
            data.loading = true;
             client.Request({
                type: "get",
                data: data.param,
                url:  client.Api.scorerecord,
                success: function (result) {
                    if (result.Rscore.length > 0)
                        for (var i = 0; i < result.Rscore.length; i++)
                            data.record.push(result.Rscore[i]);
                    else
                        data.nomore = true;           
                },
                complete: function (XMLHttpRequest, textStatus) {
                    data.loading = false;
                    self.$refs.scroller.finishInfinite();
                    appendDone(data.nomore);
                }
            })
        }

    },
    filters: FilterService.filters
})

$(function () {
 
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=%2Fmall%2Fscoregold';
        return;
    }
   
})