import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import {Toast} from "mint-ui";


var RT = new Vue({
    el: '#container',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        technology: [],
        param: { pageIndex: 1, pagesize: 10, Status: 100, },
        loading: false,
        techId: ""
    },
    methods: {
        Get: function (callback) {
            client.Request({
                type: "get",
                data: this.$data.param,
                url: client.Api.releaseTechnology,
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
                location.href = '/passport/login?returnurl=%2Ftechshare%2FreleaseTechnology';
                return;
            }
            var _self = this;
            _self.$data.loading = true;
            _self.$data.param.pageIndex = 1;
            _self.Get(function (success, res) {
                if (success) {
                    _self.$data.technology = res;
                }
                _self.$data.loading = false;
                if (done) {
                    done();
                }
            });
        },
        Append: function (done) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Ftechshare%2FreleaseTechnology';
                return;
            }
            var _self = this;
            if (this.CheckLoading()) {
                done();
                return;
            }
            var ismore = false;
            if (this.$data.technology.length) {
                _self.$data.param.pageIndex += 1;
            } else {
                this.$data.param.pageIndex = 1;
            }
            this.Get(function (success, res) {
                if (success) {
                    var list = res;
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.technology.push(list[i]);
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
        Show: function (i) {
            var self = this;
            self.$data.param.Status = i;
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        Submit: function () {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.submitreleasetech + '?id=' + self.$data.techId,
                success: function (result) {
                    $('#mask,#smt').css('display', 'none');
                    self.Refresh();
                    Toast({message:result.Message,duration:1000});
                }
            });
        },
        Edit: function (id) {
            location.href = "/techshare/publish/" + id;
        },
        Delete: function () {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.deletereleasetech + '?id=' + self.$data.techId,
                success: function (result) {
                    $('#mask,#del').css('display', 'none');
                    self.Refresh();
                    Toast({message:result.Message,duration:1000});
                }
            });
        },
        OpenD: function (id) {
            this.$data.techId = id;
            $('#mask').css({
                display: 'block',
                height: window.screen.height
            })
            var $Popup = $('#del');
            $Popup.css({
                left: ($('body').width() - $Popup.width()) / 2 + 'px',
                top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
                display: 'block'
            })
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
        },
        OpenS: function (id) {
            this.$data.techId = id;
            $('#mask').css({
                display: 'block',
                height: window.screen.height
            })
            var $Popup = $('#smt');
            $Popup.css({
                left: ($('body').width() - $Popup.width()) / 2 + 'px',
                top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
                display: 'block'
            })
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
        },
        Detail: function (id, status) {
            if (status == -99 || status == -1) {
                this.Edit(id);
            }
            else {
                location.href = '/techshare/detail/' + id;
            }
        },
        Cancel: function () {
            $('#mask,.popup').css('display', 'none');
            $("body").off("touchmove");
        }
    }
});
$(function () {
  
    Vue.filter('formatDate', function (value) {
        if (value != null && value != "") {
            return value.substring(0, 10);
        }
    });
    Vue.filter('s', function (val) {
        switch (val) {
            case -99:
                return "待提交";
                break;
            case 1:
                return "待审核";
                break;
            case -1:
                return "驳回";
                break;
            case 2:
                return "待发布";
                break;
            case 3:
                return "已发布";
                break;
            case 4:
                return "发布完成";
                break;
        }
    });
})