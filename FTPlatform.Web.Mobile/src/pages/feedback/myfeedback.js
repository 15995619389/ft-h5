import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
function appendDone() {
    return;
}
var MF = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        param: { pageindex: 1, pagesize: 10 },
        MyFeedBack: [],
       
        loading: false
    },
    methods: {
        Refresh: function () {
            if (!client.IsLogin()) {
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
                url: client.Api.myfeedback,
                success: function (result) {                   
                            data.MyFeedBack=result.Entitys;
                },
                complete: function (XMLHttpRequest, textStatus) {                   
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
            var nomore = false;
            if(data.MyFeedBack.length)
                data.param.pageindex += 1;
            else
                data.param.pageindex=1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.myfeedback,
                success: function (result) {
                    if (result.Entitys.length > 0)
                        for (var i = 0; i < result.Entitys.length; i++)
                            data.MyFeedBack.push(result.Entitys[i]);
                    else
                        nomore = true;
                },
                complete: function (XMLHttpRequest, textStatus) {  
                    if (textStatus == 'error')
                        nomore = true;
                    data.loading = false;
                    self.$refs.scroller.finishInfinite();
                    appendDone(nomore);
                }
            })
        },
        Detail:function(id){
            location.href = '/feedback/feedbackdetail/' + id;
        }
    }
});

$(function () {  
    Vue.filter("r", function (val) {
        if (val)
            return "已回复";
        else
            return "未回复";
    });
    Vue.filter("ds", function (val) {
        if (val.length > 9)
            return val.substring(0, 9) + ".....";
        else
            return val;
    })
    Vue.filter('formatDate', function (value) {
        if (value != null && value != "") {
            return value.substring(0, 10);
        }
    });

    $(".mui-scroll .mui-pull-bottom-pocket").css("display", "none");
    $('._v-content').css("margin-top", "45px");
})