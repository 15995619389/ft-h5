var ActId = $("#ActId").val();
var Vm = new Vue({
    el: ".mui-content",
    data: {
        isCheckinDay: false,//当天是否签到
        checkinNumber: 0,//连续签到天数
        scoreActNumber: 0,//签到总获得智币数
        IsOpenSeven: false,//七天签到状态弹框
    },
    methods: {
        CheckinRule: function () {//签到规则弹窗
            $(".mask").css({
                "display": "block"
            });
            $(".sign-box").css({
                "display": "block"
            });
            $('html,body').addClass("Ovhidden");
            $('body').bind("touchmove", function (e) {
                e.preventDefault();
            });
        },
        NowsignOpen: function () {////立即签到弹窗
            if (!$.isLogin()) {
                window.location.href = "/passport/login?returnurl=%2Factivity%2FSepActivity";
                return;
            }
            this.CheckinPlayUp();
            $(".mask").css({
                "display": "block"
            });
            $(".immed-sign").css({
                "display": "block"
            });
            $('html,body').addClass("Ovhidden");
            $('body').bind("touchmove", function (e) {
                e.preventDefault();
            });
            ////如果添加验证
            //$.take({
            //    type: "post",
            //    url: "/Activities/ChecjinValidate?ActId=" + ActId,
            //    success: function (reulst) {
            //        if (reulst.Flag) {

            //        } else {
            //           alert(reulst.Message);
            //        }
            //    }, complete: function () {
            //    }
            //});
        },
        CheckinPlayUp: function () {//渲染
            var _data = this;
            if (!$.isLogin()) {
                return;
            }
            //连续签到天数及智币获得数
            $.take({
                type: "post",
                url: "/Activities/scorenumber?ActId=" + ActId,
                success: function (reulst) {
                    _data.isCheckinDay = reulst.isCheckinDay;
                    _data.checkinNumber = reulst.checkinNumber;
                    _data.scoreActNumber = reulst.scoreActNumber;
                    //初始化签到样式
                    var ul = $(".wisdom-list ul")
                    ul.html("");
                    $.each(reulst.FiveAttr, function (i, item) {
                        var html = "<li><span class=\"plusnumber\">+" + item.remark + "</span> <i></i><div class=\"sg-finsh\"></div></li>";
                        if (item.IsCheckin) {
                            html = "<li><span class=\"plusnumber cur-color\">+" + item.remark + "</span> <i class=\"curzhibi\"></i><div class=\"sg-finsh finsh-show\"></div></li>";
                        }
                        ul.append(html);
                    });
                    //var ul = $(".wisdom-list ul li").eq(_data.checkinNumber).prevAll();
                    //ul.children("span").addClass('cur-color');
                    //ul.children("i").addClass('curzhibi');
                    //ul.children("div").addClass('finsh-show');

                    if (_data.checkinNumber >= 7 && _data.IsOpenSeven) {
                        $("#sigclick").text("签到完成");
                        _data.CloseOpen('immed-sign');//关闭签到弹窗
                        //连续七天弹窗
                        $(".mask").css({
                            "display": "block"
                        });
                        $(".complete-box").css({
                            "display": "block"
                        });
                        $('html,body').addClass("Ovhidden");
                        $('body').bind("touchmove", function (e) {
                            e.preventDefault();
                        });
                        _data.IsOpenSeven = false;
                    } else if (_data.isCheckinDay && reulst.respond.Flag && _data.checkinNumber < 7) {
                        if (reulst.IsText) {
                            $("#sigclick").text("今日签到");
                        } else {
                            $("#sigclick").text("明日签到可获得" + Math.pow(2, _data.checkinNumber + 1) + "枚智币");
                        }
                    } else if (!reulst.respond.Flag) {
                        $("#sigclick").text(reulst.respond.Message);
                    } else if (_data.checkinNumber == 7) {
                        $("#sigclick").text("签到完成");
                    }
                    if (_data.isCheckinDay) $('.sign-button').addClass('status-ok');
                }, complete: function () {
                }
            });
        },
        SigCheckin: function () {//立即签到
            var _data = this;
            if (_data.isCheckinDay) return;
            $.take({
                type: "post",
                url: "/Activities/checkin?ActId=" + ActId,
                success: function (reulst) {
                    if (reulst.Flag) {
                        if (reulst.StausCode == "7") {
                            $("#SevenPrize").text("恭喜获得254枚智币和" + reulst.Message);
                            _data.IsOpenSeven = true;
                        }
                        _data.CheckinPlayUp();
                    } else {
                        layer.alert(reulst.Message);
                    }
                }, complete: function () {
                }
            });
        },
        CloseOpen: function (classIndex) {
            $(".mask").css({
                "display": "none"
            });
            $("." + classIndex).css({
                "display": "none"
            });
            $('html,body').removeClass("Ovhidden");
            $('body').unbind("touchmove");
        },
    },
    created: function () {
        this.CheckinPlayUp();
    }
});
