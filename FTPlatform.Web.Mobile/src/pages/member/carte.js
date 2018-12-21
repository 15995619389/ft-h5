import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import {Toast} from "mint-ui";

function appendDone() {
    return;
}
Vue.filter('formatDate', function (value) {
    if (value != null && value != "") {
        return value.substring(0, 10);
    }
});
var Carte = new Vue({
    el: '.mui-content',
    data: {
        param: {
            pageindex: 1,
            pagesize: 10,
            status: 99
        },
        cartes: [],
        loading: false
    },
    components: {
        scroller: scroller.Scroller
    },
    methods: {
        Refresh: function () {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fcarte';
                return;
            }
            var data = this.$data;
            data.loading = true;
            data.param.pageindex = 1;
            var self = this;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.carte,
                success: function (result) {
                    if (result.Flag)
                        data.cartes = result.DataSource;
                },
                complete: function (XMLHttpRequest, textStatus) {
                    data.loading = false;
                    self.$refs.scroller.finishPullToRefresh();
                }
            })
        },
        Append: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fcarte';
                return;
            }
            var data = this.$data;
            var self = this;
            var nomore = false;
            appendDone = done;
            if (data.loading) {
                if (appendDone)
                    appendDone();
                return
            }
            data.loading = true;
            if (data.cartes.length)
                data.param.pageindex += 1;
            else
                data.param.pageindex = 1;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.carte,
                success: function (result) {
                    if (result.DataSource.length == 0)
                        nomore = true;
                    else
                        for (var i = 0; i < result.DataSource.length; i++)
                            data.cartes.push(result.DataSource[i]);
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
        Change: function (i) {
            var self = this;
            var data = this.$data;
            data.param.status = i;
            this.$refs.scroller.triggerPullToRefresh();
        },
        Receive: function (id) {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.cartereceive + '?id=' + id,
                success: function (result) {
                    if (result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});
                }

            })
        },
        Reject: function (id) {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.cartereject + '?id=' + id,
                success: function (result) {
                    if (result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});
                }

            })
        },
        Delete: function (id) {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.cartedelete + '?id=' + id,
                success: function (result) {
                    if (result.Flag)
                        self.Refresh();
                    Toast({message:result.Message,duration:1000});
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});
                }

            })
        },
        Look: function (carte) {
            location.href = '/mybusiness/mycarte/' + carte.UserId;
        },
        MyCarte: function () {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fcarte';
                return;
            } else
                location.href = '/mybusiness/mycarte/' + client.GetCurrentUser().Id;
        }
    }
})

$(function () {
    $(".state li").click(function () {
        $(this).addClass("text_color").siblings().removeClass("text_color");

    })
    $("._v-content").css("margin-top", "88px");

})