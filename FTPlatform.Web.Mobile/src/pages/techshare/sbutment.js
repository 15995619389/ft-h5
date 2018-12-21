import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";

var TchMg = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        tech: [],
        param: { pageIndex: 1, pageSize: 10 },
        loading: false,
    },
    methods: {
        Get: function (callback) {
            client.Request({
                type: "get",
                data: this.$data.param,
                url: client.Api.sbutment,
                success: function (res) {
                    callback(true, res);
                },
                error: function (res) {
                    callback(false, null);
                }
            });
        },
        Refresh: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Ftechshare%2Fsbutment';
                return;
            }
            var _self = this;
            _self.$data.loading = true;
            _self.$data.param.pageIndex = 1;
            _self.Get(function (success, res) {
                if (success) {
                    _self.$data.tech = res.Entitys;
                }
                _self.$data.loading = false;
                if (done) {
                    done();
                }
            });
        },
        Append: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Ftechshare%2Fsbutment';
                return;
            }
            var _self = this;
            if (this.CheckLoading()) {
                done();
                return;
            }
            var ismore = false;
            if (this.$data.tech.length) {
                _self.$data.param.pageIndex += 1;
            } else {
                this.$data.param.pageIndex = 1;
            }
            this.Get(function (success, res) {
                if (success) {
                    var list = res.Entitys;
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.tech.push(list[i]);
                        }
                    } else {
                        ismore = true;
                    }
                }
                if (res == null) {
                    ismore = true;
                }
                done(ismore);
            });
        },
        CheckLoading: function () {
            var self = this;
            if (this.$data.loading) {
                setTimeout(function () {
                    self.CheckLoading();
                }, 2000);
            } else {
                return false;
            }
        },
        Detail: function (id) {
            location.href = '/techshare/detail/' + id;
        }
    }
});
$(function () {
    Vue.filter('removeHTMLTag', function (str) {
        if (str != null && str != "" & str != undefined) {
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str = str.replace(/ /ig, '');//去掉
            str = str.replace(/&nbsp;/ig, '');
            str = str.replace(/\s/g, "");
            return str;
        }
    });
    Vue.filter('formatDate', function (value) {
        if (value != null && value != "") {
            return value.substring(0, 10);
        }
    });
    $('._v-content').css("margin-top", "30px");
})
