import * as client from "../../modules/ApiClient";
import Vue from "vue";
import { Toast } from 'mint-ui';

var Code = $("#Code").val();
var vm = new Vue({
    el: ".mui-content",
    data: {
        order: {},
        needScore: 0,
        cue: {
            suppleMoney: 0,
            needScore: 0,
            noNeedScore: 0,
        },
        IsSub: true,
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
        },
        formatDate: function (value) {
            if (value == null && value == "") {
                return "";
            }
            return value.substring(0, 10);
        }
    },
    methods: {
        Reresh: function () {
            if (!client.IsLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            var _data = this;
            client.Request({
                type: "get",
                url: client.Api.orderdetail + "?OrderCode=" + Code,
                success: function (reulst) {
                    if (reulst.Flag) {
                        _data.order = reulst.GetData;
                        _data.needScore = reulst.needScore;
                    } else {
                        layer.msg(reulst.Message, { time: 3000, icon: 2 });
                    }

                }, complete: function () {
                }
            })
        },
        CancelOrder: function () {
            if (!client.IsLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
            layer.confirm('你确定要取消此订单?', { title: '提示', skin: 'layui-layer-syclass', end: function () { $("body").off("touchmove"); } }, function (index) {

                client.Request({
                    type: "post",
                    url: client.Api.cancelorder + "?OrderCode=" + Code,
                    success: function (reulst) {
                        if (reulst.Flag) {
                            layer.msg(reulst.Message + ", 正在跳转...", { time: 3000, shade: 0.3, skin: 'layui-layer-rim' }, function () {
                                location.href = "/mall/orderfromindex";
                            });
                        } else {
                            layer.msg(reulst.Message, { time: 3000, icon: 2 });
                        }
                    }, complete: function () {
                    }
                })

                layer.close(index);
            });
        },
        PayCue: function (code) {
            if (!client.IsLogin()) {
                window.location.href = "/passport/login?returnurl=%2Fmall%2Forderfromindex";
                return;
            }
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            });
            var _datacue = this.cue;
            var _data = this;
            if (_data.IsSub) {
                _data.IsSub = false;
                client.Request({
                    type: "post",
                    url: client.Api.ordercue + "?orderCode=" + code,
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
                                btnAlign: 'c',
                                btn: ['立即支付', '取消'],
                                yes: function () {
                                    _data.PayMent(code);
                                },
                                end: function () {
                                    $("body").off("touchmove")
                                    login.hide();
                                }
                            });
                        } else {
                            layer.alert(reulst.Message);
                        }
                    }, complete: function () {
                        _data.IsSub = true;
                    }
                })
            }
        },
        PayMent: function (code) {
            client.Request({
                type: "post",
                url: client.Api.payment + "?orderCode=" + code,
                success: function (reulst) {
                    if (reulst.Flag) {
                        if (reulst.IsRedirect) {
                            location.href = reulst.RedirectUrl;
                        } else {
                            client.Request({
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
        modityDteail: function (modityCode) {
            window.location.href = "/mall/detail/" + modityCode;
        }
    },
    created: function () {
        this.Reresh();
    }
});

$("#retUrl").click(function(){
    window.location.href = "/mall/orderfromindex?timemp=" + new Date().getMilliseconds();
});