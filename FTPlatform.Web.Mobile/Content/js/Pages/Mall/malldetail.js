$(function () {
    var code = $("#code").val();
    var vm = new Vue({
        el: ".mui-content",
        data: {
            getdata: [],
            fristImg:{},//第一张图片 轮播需要
            lastImg:{},//最后一张图片 轮播需要
            subFrom: {
                code: "",
                number: 1,
                //people: "",
                cargo: "",
                telephony: "",
                address: "",
            },
            user: null,
            userscore: null,
            IsSubmit: true,
            cue: {
                suppleMoney: 0,
                needScore: 0,
                noNeedScore: 0,
            },
        },
        methods: {
            Reresh: function () {
                var _data = this;
                var user = $.getUser();
                if (user) {
                    _data.user = user;
                }
                $.take({
                    type: "get",
                    url: "/mall/detail",
                    data: { Id: code },
                    success: function (reulst) {
                        if (reulst.ModityType == 3) {
                            $(".mui-title").text("话费充值卡");
                            if (!$.isLogin()) {
                                $("#LoginDown").show();
                                $("#openSheet").addClass("buysm");
                            }
                        } else if (reulst.ModityType == 2) {
                            $(".mui-title").text("抵用券");
                        } else if (reulst.ModityType == 1) {
                            $(".mui-title").text("实物");
                        }
                        if (reulst.ModityNumber <= 0) {//库存
                            $("#openSheet").css("background", "#999");
                            $("#openSheet").unbind();
                        }
                        _data.getdata = reulst;
                        _data.fristImg = reulst.ModityImgAll == null ? "" : reulst.ModityImgAll[0];
                        _data.lastImg = reulst.ModityImgAll == null ? "" : reulst.ModityImgAll[reulst.ModityImgAll.length - 1];
                    }
                })
            },
            addInput: function (inptValue, type) {
                if (inptValue == 0) return;
                var _data = this;
                var number = $("#modNumber").val();
                var add = parseInt(number) + 1;
                var del = parseInt(number) - 1;
                if (type == '+') {
                    if (add > inptValue) {
                        $("#modNumber").val(inptValue);
                        _data.subFrom.number = inptValue;
                        return;
                    }
                    $("#modNumber").val(add);
                    _data.subFrom.number = add;
                } else if (type == '-') {
                    if (del <= 0) {
                        $("#modNumber").val(1);
                        _data.subFrom.number = 1;
                        return;
                    }
                    $("#modNumber").val(del);
                    _data.subFrom.number = del;
                } else {
                    if (number > inptValue) {
                        $("#modNumber").val(inptValue);
                        _data.subFrom.number = inptValue;
                        return;
                    } else if (number <= 0) {
                        $("#modNumber").val(1);
                        _data.subFrom.number = 1;
                        return;
                    }
                    $("#modNumber").val(number);
                    _data.subFrom.number = number;
                }
                _data.ScoreUser();
            },
            addInput2: function (inptValue, type) {
                if (inptValue == 0) return;
                var _data = this;
                var number = $("#modNumber2").val();
                var add = parseInt(number) + 1;
                var del = parseInt(number) - 1;
                if (type == '+') {
                    if (add > inptValue) {
                        $("#modNumber2").val(inptValue);
                        _data.subFrom.number = inptValue;
                        return;
                    }
                    $("#modNumber2").val(add);
                    _data.subFrom.number = add;
                } else if (type == '-') {
                    if (del <= 0) {
                        $("#modNumber2").val(1);
                        _data.subFrom.number = 1;
                        return;
                    }
                    $("#modNumber2").val(del);
                    _data.subFrom.number = del;
                } else {
                    if (number > inptValue) {
                        $("#modNumber2").val(inptValue);
                        _data.subFrom.number = inptValue;
                        return;
                    } else if (number <= 0) {
                        $("#modNumber2").val(1);
                        _data.subFrom.number = 1;
                        return;
                    }
                    $("#modNumber2").val(number);
                    _data.subFrom.number = number;
                }
                _data.ScoreUser();
            },
            popClose: function () {
                $("#sheet").css({ "display": "none" })
                $(".mui-backdrop").css({ "display": "none" })
                mui('.mui-popover').popover('hide');
                this.$data.subFrom.cargo = "";
            },
            isLoginShow: function () {
                if (!$.isLogin()) {
                    location.href = '/passport/login?returnurl=%2Fmall%2Fdetail%2F' + vm.getdata.ModityCode;
                    return;
                }
            },
            ScoreUser: function () {
                if (!$.isLogin()) {
                    return;
                }
                $.take({
                    type: "post",
                    url: "/mall/userscorenumber?moidtyCode=" + code + "&modityNumber=" + vm.subFrom.number,
                    success: function (reulst) {
                        if (reulst.status) {
                            vm.userscore = reulst;
                        } else {
                            layer.msg(reulst.message, { time: 2000 });
                        }
                    }
                })
            },
            SubOrderFrom: function () {
                var _data = this;
                _data.subFrom.code = _data.getdata.ModityCode;
                if (_data.IsSubmit) {
                    _data.IsSubmit = false;
                    $.take({
                        type: "get",
                        url: $.api.suborderfrom,
                        data: _data.subFrom,
                        success: function (reulst) {
                            if (reulst.Flag) {
                                _data.PayCue(reulst.StausCode);
                            } else {
                                if (reulst.StausCode == "2") {
                                    layer.alert(reulst.Message, {
                                        skin: 'layui-layer-syclass',
                                        btn: ['立即前往', '取消'],
                                        closeBtn: 0,
                                        yes: function () {
                                            location.href = "/mall/orderfromindex";
                                        },
                                        btn2: function () {
                                            mui("#sheet").popover('toggle');
                                        }
                                    });
                                } else {
                                    layer.alert(reulst.Message, { skin: 'layui-layer-syclass', });
                                }
                            }
                        }, complete: function () {
                            _data.IsSubmit = true;
                        }
                    })
                }
                // _data.PayCue("ft20170808-0000004");
            },
            PayCue: function (code) {
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
                                btnAlign: 'c',
                                btn: ['立即支付', '取消'],
                                yes: function () {
                                    _data.PayMent(code);
                                },
                                end: function () {
                                    login.hide();
                                }
                            });
                        } else {
                            layer.alert(reulst.Message, { skin: 'layui-layer-syclass', });
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
            Validate: function () {
                var _data = this;
                $.take({
                    type: "post",
                    url: "/mall/subvalidate?mcode=" + code + "&modnumber=" + vm.subFrom.number,
                    success: function (reulst) {
                        if (reulst.Flag) {
                            _data.SherPopover();
                        } else {
                            if (reulst.StausCode == "2") {
                                layer.alert(reulst.Message, {
                                    skin: 'layui-layer-syclass',
                                    btn: ['立即前往', '取消'],
                                    closeBtn: 0,
                                    yes: function () {
                                        location.href = "/mall/orderfromindex";
                                    }
                                });
                            } else {
                                layer.alert(reulst.Message, { skin: 'layui-layer-syclass', });
                            }
                        }

                    }
                })
            },
            SherPopover: function () {
                $.take({
                    type: "post",
                    url: "/mall/userscorenumber?moidtyCode=" + code + "&modityNumber=" + vm.subFrom.number,
                    success: function (reulst) {
                        if (reulst.overtop) {
                            layer.alert(reulst.message, { skin: 'layui-layer-syclass', });
                        } else {
                            if (reulst.status) {
                                vm.userscore = reulst;
                                mui("#sheet").popover('toggle');
                            } else {
                                layer.msg(reulst.message, { time: 2000 });
                            }
                        }
                    }
                })
            },
        },
        created: function () {
            this.Reresh();
        }
    });

    $("#openSheet").click(function () {
        vm.isLoginShow();
        //var people = vm.subFrom.people;
        var telephony = vm.subFrom.telephony;
        var address = vm.subFrom.address;
        if (vm.getdata.ModityType == 3) {
            vm.isLoginShow();
        } else {
            //if (!people) {
            //    layer.tips("收货人不能为空", "#people", { tips: [1, 'red'] });
            //    return;
            //}
            if (!address) {
                layer.tips("收货地址不能为空", "#address", { tips: [1, 'red'] });
                $("#address").focus();
                return;
            }
            if (!telephony) {
                layer.tips("联系电话不能为空", "#telephony", { tips: [1, 'red'] });
                $("#telephony").focus();
                return;
            } else {
                var IsNo = /^1[34578]\d{9}$/.test(telephony);
                if (!IsNo) {
                    layer.tips("联系电话录入不正确！", "#telephony", { tips: [1, 'red'] });
                    $("#telephony").focus();
                    return;
                }
            }
        }
        vm.Validate();
        //$.take({
        //    type: "post",
        //    url: "/mall/userscorenumber?moidtyCode=" + code + "&modityNumber=" + vm.subFrom.number,
        //    success: function (reulst) {
        //        if (reulst.overtop) {
        //            layer.alert(reulst.message, { skin: 'layui-layer-syclass', });
        //        } else {
        //            if (reulst.status) {
        //                vm.userscore = reulst;
        //                mui("#sheet").popover('toggle');
        //            } else {
        //                layer.msg(reulst.message, { time: 2000 });
        //            }
        //        }
        //    }
        //})
    });

    $("#LoginDown").click(function () {
        vm.isLoginShow();
    });
});

var issubmit = function () {

    // $("#openSheet").attr("href", "#sheet");
}