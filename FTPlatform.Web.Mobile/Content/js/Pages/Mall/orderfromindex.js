var vm = new Vue({
    el: ".mui-content",
    data: {
        order: [],
        searchs: {
            search: "",
            modityType: 0,
            orderType: -1,
            pageIndex: 1,
            pageSize: 8,
        },
        IsServer: false,
        cue: {
            suppleMoney: 0,
            needScore: 0,
            noNeedScore: 0,
        },
        IsSub: true,
        LoadingType: false,
    },
    filters: {
        type: function (value) {
            var typeVal = "待付款";
            switch (value) {
                case 1:
                    typeVal = "已付款";
                    break;
                case 2:
                    typeVal = "已申请换货";
                    break;
                case 3:
                    typeVal = "已申请退货";
                    break;
                case 4:
                    typeVal = "换货成功";
                    break;
                case 5:
                    typeVal = "退货成功";
                    break;
                case 6:
                    typeVal = "换货失败";
                    break;
                case 7:
                    typeVal = "退货失败";
                    break;
                case 8:
                    typeVal = "订单完成";
                    break;
                case 9:
                    typeVal = "无效订单";
                    break;
                default:
            }
            return typeVal;
        }
    },
    methods: {
        Reresh: function () {
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            var _data = this;
            _data.searchs.pageIndex = 1;
            layer.msg("正在加载...", { time: 200000, shade: 0.2 });
            $.take({
                type: "get",
                url: $.api.pageorderfrom,
                data: _data.searchs,
                success: function (reulst) {
                    //// _data.order = [];
                    //if (reulst.length < _data.searchs.pageSize) {
                    //    //_data.searchs.pageIndex = 0;
                    //    //_data.RereshDown();
                    //    //mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    //}
                    _data.order = reulst;
                }, complete: function () {
                    layer.closeAll('dialog');
                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                    _data.Scroll();
                    //mui('#refreshContainer').pullRefresh().refresh(true);//重置上拉加载
                    //_data.LoadingType = false;
                }
            })
        },
        RereshDown: function () {
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            var _data = this;
            _data.searchs.pageIndex += 1;
            $.take({
                type: "get",
                url: $.api.pageorderfrom,
                data: _data.searchs,
                success: function (reulst) {
                    if (reulst.length < _data.searchs.pageSize) {
                        _data.LoadingType = true;
                    }
                    for (var i = 0; i < reulst.length; i++) {
                        _data.order.push(reulst[i]);
                    }
                }, complete: function () {
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(_data.LoadingType);
                }
            })
        },
        SeachIndex: function (type) {
            var _data = this;
            if (type == 99)
                _data.searchs.modityType = 1;
            else
                _data.searchs.modityType = 0;
            _data.searchs.orderType = type;
            mui('#refreshContainer').pullRefresh().refresh(true);//重置上拉加载
            _data.LoadingType = false;
            _data.Reresh();
        },
        OrderDetail: function (ordercode) {
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            location.href = "/mall/orderfromdetail/" + ordercode;
        },
        ApplyCustome: function (ordercode) {//申请售后
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            location.href = "/mall/customer/" + ordercode;
        },
        PayCue: function (code) {
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            var _datacue = this.cue;
            var _data = this;
            $.take({
                type: "post",
                url: $.api.ordercue + "?orderCode=" + code,
                success: function (reulst) {
                    if (reulst.Flag) {
                        var login = $("#dloag2");
                        if (reulst.IsKind && reulst.suppleMoney != 0)
                            login = $("#dloag1");
                        _datacue.needScore = reulst.suppleMoney == 0 ? reulst.needScore : reulst.userScore;
                        _datacue.noNeedScore = reulst.needScore;
                        _datacue.suppleMoney = reulst.suppleMoney;
                        layer.open({
                            skin: 'layui-layer-syclass',
                            type: 1,
                            area: ['260px', '180px'],
                            title: "提示",
                            content: login,
                            btn: ['立即支付', '取消'],
                            btnAlign: 'c',
                            yes: function () {
                                _data.PayMent(code);
                            },
                            end: function () {
                                _data.IsSub = true;
                                login.hide();
                            }
                        });
                    } else {
                        layer.alert(reulst.Message, { skin: 'layui-layer-syclass', end: function () { _data.IsSub = true; } });
                    }
                }, complete: function () {

                }
            })
        },
        PayMent: function (code) {
            $.take({
                type: "post",
                url: $.api.payment + "?orderCode=" + code,
                success: function (reulst) {
                    if (reulst.Flag) {
                        if (reulst.IsRedirect) {
                            location.href = reulst.RedirectUrl;
                        } else {
                            $.take({
                                type: "post",
                                url: "/mall/payhtml?orderCode=" + reulst.StausCode,
                                dataType: 'html',
                                success: function (result) {
                                    $("#data").html(result);
                                },
                                complete: function () {
                                }
                            })
                        }
                    } else {
                        if (reulst.IsRedirect) {
                            location.href = reulst.RedirectUrl;
                        } else {
                            layer.msg(reulst.Message);
                        }
                    }

                }, complete: function () {

                }
            })
        },
        Scroll: function () {
            mui('#refreshContainer').pullRefresh().scrollTo(0, 0, 100);
        },

    },
    created: function () {
        this.Reresh();
    }

});
mui.init({
    pullRefresh: {
        container: "#refreshContainer",
        down: {
            style: 'circle',
            color: '#2BD009',
            height: 50,
            callback: function () {
                vm.Reresh();
            }
        },
        up: {
            contentinit: '  ',
            contentdown: '  ',
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了',
            callback: function () {
              
                vm.RereshDown();
            }
        }
    }
});
//立即支付
mui('.mui-content').on('tap', '#subPay', function (e) {
    var id = this.getAttribute('code');
    if (vm.IsSub) {
        vm.IsSub = false;
        vm.PayCue(id);
        $("body").on("touchmove", function (e) {
            e.preventDefault();
        });
    } else {
        $("body").off("touchmove");
    }
});
//订单详情
mui('.mui-content').on('tap', '#odDetail', function (e) {
    var id = this.getAttribute('code');
    var odtype = this.getAttribute('odtype');
    if (odtype > 3 && odtype < 8) {
        location.href = "/mall/schedule/" + id;
    } else {
        vm.OrderDetail(id);
    }
});
//售后
mui('.mui-content').on('tap', '#Custome', function (e) {
    var id = this.getAttribute('code');
    vm.ApplyCustome(id);
});