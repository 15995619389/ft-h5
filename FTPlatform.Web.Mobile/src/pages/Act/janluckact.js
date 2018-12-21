$(function () {
    ActLuck.DataInit();
})
var ActLuck = {
    flag: false,
    index: 0,
    TextNum1: null,
    TextNum2: null,
    TextNum3: null,
    ZIndex: 0,
    MallActId: 0,
    DataInit: function () {
        $.ajax({
            url: '/Content/js/Pages/Act/ActGather.xml?data=' + new Date().getMinutes,
            type: 'GET',
            dataType: 'xml',
            timeout: 8000,
            cache: false,
            error: function (xml) {
                alert("活动数据加载失败");
            },
            success: ActLuck.Init
        });
    },
    Init: function (ActData) {
        ActLuck.MallActId = $(ActData).find('Activity').children('ActId:last').text();
        ActLuck.ActPrizeList();
        $(".cur-cj").addClass("show");
        $(".main3-btn").click(function () {
            ActLuck.BottonBind();
            $("html,body").animate({
                scrollTop: 150
            })
        });
    },
    BottonBind: function () {
        if (!ActLuck.flag) {
            ActLuck.flag = true;
            ApiClient.Request({
                url: '/activities/scoreshoop?ActId=' + ActLuck.MallActId,
                type: 'post',
                success: function (data) {
                    if (data.Flag) {
                        $(".side_yg").animate({
                            top: '2.2rem'
                        });

                        $(".side_yg").animate({
                            top: '1.1rem'
                        });
                        ActLuck.reset();
                        ActLuck.letGo();
                    } else {
                        if (data.StausCode == 0) {
                            ActLuck.OpenBlackUI("pubpop-box1");
                            ActLuck.flag = false;
                        } else if (data.StausCode == 1) {
                            alert("活动加载失败（未找到）!");
                            ActLuck.flag = false;
                        } else if (data.StausCode == 2) {
                            alert("活动未开始");
                            ActLuck.flag = false;
                        } else if (data.StausCode == 3) {
                            alert("活动已结束");
                            ActLuck.flag = false;
                        } else if (data.StausCode == 4) {
                            ActLuck.OpenBlackUI("pubpop-box4");
                            ActLuck.flag = false;
                        }
                    }

                }
            })
        }
    },
    reset: function () {
        $(".num-con1,.num-con2,.num-con3").css({ "top": 0 });
    },
    letGo: function () {
        ActLuck.ZIndex = 0;
        var PrizeAngle = { "1": 0, "2": 66, "3": 135, "4": 205, "5": 275, "6": 344, "7": 410, "8": 480, "9": 550, "0": 620 };
        ApiClient.Request({
            url: '/activities/oneactprize?ActId=' + ActLuck.MallActId,
            type: 'post',
            success: function (data) {
                if (data.Flag) {
                    switch (data.Message) {
                        case "6枚智币":
                            ActLuck.TextNum1 = PrizeAngle[0];
                            ActLuck.TextNum2 = PrizeAngle[0];
                            ActLuck.TextNum3 = PrizeAngle[6];
                            break;
                        case "16枚智币":
                            ActLuck.TextNum1 = PrizeAngle[0];
                            ActLuck.TextNum2 = PrizeAngle[1];
                            ActLuck.TextNum3 = PrizeAngle[6];
                            break;
                        case "66枚智币":
                            ActLuck.TextNum1 = PrizeAngle[0];
                            ActLuck.TextNum2 = PrizeAngle[6];
                            ActLuck.TextNum3 = PrizeAngle[6];
                            break;
                        case "166枚智币":
                            ActLuck.TextNum1 = PrizeAngle[1];
                            ActLuck.TextNum2 = PrizeAngle[6];
                            ActLuck.TextNum3 = PrizeAngle[6];
                            break;
                        case "666枚智币":
                            ActLuck.TextNum1 = PrizeAngle[6];
                            ActLuck.TextNum2 = PrizeAngle[6];
                            ActLuck.TextNum3 = PrizeAngle[6];
                            break;
                        case "谢谢参与":
                            ActLuck.TextNum1 = PrizeAngle[ActLuck.RandomLuck(parseInt(Math.random() * 9))];
                            ActLuck.TextNum2 = PrizeAngle[ActLuck.RandomLuck(parseInt(Math.random() * 9))];
                            ActLuck.TextNum3 = PrizeAngle[ActLuck.RandomLuck(parseInt(Math.random() * 9))];
                            break;
                    }
                    $(".num-con1").animate({ "top": -600 }, 1000, "linear", function () {

                        $(this).css("top", 0).animate({ "top": "-" + ActLuck.TextNum1 / 100 + "rem" }, 1000, "linear", function () { ActLuck.ZIndex++; ActLuck.StopAction(data.Message) });
                    });
                    $(".num-con2").animate({ "top": -600 }, 1000, "linear", function () {

                        $(this).css("top", 0).animate({ "top": "-" + ActLuck.TextNum2 / 100 + "rem" }, 1000, "linear", function () { ActLuck.ZIndex++; ActLuck.StopAction(data.Message) });
                    });
                    $(".num-con3").animate({ "top": -600 }, 1000, "linear", function () {

                        $(this).css("top", 0).animate({ "top": "-" + ActLuck.TextNum3 / 100 + "rem" }, 1000, "linear", function () { ActLuck.ZIndex++; ActLuck.StopAction(data.Message) });
                    });
                } else {
                    if (data.StausCode == 0) {
                        ActLuck.OpenBlackUI("pubpop-box1");
                        ActLuck.flag = false;
                    } else if (data.StausCode == 1) {
                        alert("活动加载失败（未找到）!");
                        ActLuck.flag = false;
                    } else if (data.StausCode == 2) {
                        alert("活动未开始");
                        ActLuck.flag = false;
                    } else if (data.StausCode == 3) {
                        alert("活动已结束");
                        ActLuck.flag = false;
                    } else if (data.StausCode == 5) {
                        ActLuck.OpenBlackUI("pubpop-box4");
                        ActLuck.flag = false;
                    }
                }
            }
        });
    },
    RandomLuck: function (index) {
        var indexString = "0,1,6";
        if (indexString.indexOf(index) >= 0) {
            return ActLuck.RandomLuck(parseInt(Math.random() * 9));
        } else {
            return index;
        }
    },
    StopAction: function (prizeText) {

        if (ActLuck.ZIndex >= 3) {
            $(".cur-cj").addClass("show");
            setTimeout(function () {
                ActLuck.flag = false;
                if (prizeText == "谢谢参与") {
                    ActLuck.OpenBlackUI("pubpop-box2");
                } else {
                    $(".pubpop-box3>div>div>div>span").text("恭喜您，获得" + prizeText + ",")
                    ActLuck.OpenBlackUI("pubpop-box3");
                }
            }, 500)
        }
    },
    OpenBlackUI: function (className) {
        $(".mask").css("display", "block");
        $("." + className).css("display", "block");
        $(".comon-bd").css("display", "block");
        $('html,body').addClass("Ovhidden");
        $('body').bind("touchmove", function (e) {
            e.preventDefault();
        });
    },
    CloseBlackUI: function (className) {
        $(".mask").css("display", "none");
        $("." + className).css("display", "none");
        $(".pubpop-box").css("display", "none");
        $('html,body').removeClass("Ovhidden");
        $('body').unbind();
    },//
    ActPrizeList: function () {
        ApiClient.Request({
            url: '/activities/oneactprizelist?ActId=' + ActLuck.MallActId,
            type: 'post',
            success: function (data) {
                $(".text_marqu").children().remove();
                var html = ""
                $.each(data, function (i, item) {
                    html += "<p>恭喜用户" + item.Item1 + "获得" + item.Item2 + "</p>";
                });
                $(".text_marqu").append(" <marquee id=\"quee\" direction=\"up\" height=\"270\" behavior=\"scroll\" scrolldelay=\"160\" loop=\"-1\" style=\"text-align:left;\">" + html + "</marquee>");
            }
        });
    }
}