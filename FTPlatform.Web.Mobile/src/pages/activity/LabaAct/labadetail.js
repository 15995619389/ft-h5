$(function () {
    H5LabaAct.Init();
    // H5LabaAct.OpenBlackUI("domMessage5");
    //活动细则
    $(".rules img").on("click", function () {
        $("#mask").show();
        $(".rules_box").show();
    })
    //关闭、返回游戏、遮罩层
    $(".close_btn,.close,#mask").on("click", function () {
        $(".my_gift").hide();
        $("#mask").hide();
        $(".rules_box").hide();
        $(".draw_model").hide();
    })
});
var H5LabaAct = {
    IsCarryOut: false,//是否可拆福袋
    IsDrow: false,//是否可抽奖
    IsFirstShow: true,
    Init: function () {
        H5LabaAct.InitData();
        H5LabaAct.GamePlayNumber();
        H5LabaAct.DrawRostre();
    },
    InitData: function () {//初始化八宝数据
        ApiClient.Request({
            url: "/activities/GetActPrizeCoin",
            type: "post",
            dataType: "json",
            success: function (data) {
                var coin = $(".bag_content");
                coin.children().remove();
                $.each(data, function (i, item) {
                    var scur = (item.Count > 0) ? "1" : "2";
                    var sshow = (item.Count > 0) ? "bag_spam_show" : "bag_spam_none";
                    var showHtml = " <li>";
                    showHtml += " <div class=\"div0\" style='display:block;'>";
                    showHtml += "<span class='" + sshow + "'>X" + item.Count + "</span>";
                    showHtml += "<img src=\"/Content/image/activity/laba/" + item.Img + scur + ".png\" />";
                    showHtml += "</div>";
                    showHtml += "</li> ";
                    coin.append(showHtml);
                });
            }
        });
        //LabaAct.RandomCoin();
    },
    GamePlayNumber: function () {//福袋数
        ApiClient.Request({
            url: "/activities/luckynmber",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (!ApiClient.IsLogin()) {
                    $(".bag_title").children().hide().eq(0).show();
                } else {
                    if (data.Flag) {
                        $(".bag_title").children().hide().eq(3).show();
                        H5LabaAct.IsDrow = true;
                        var spanNumb = $(".raffle_content>div").hide().last().children('span:lt(1)');
                        spanNumb.text("X" + data.RedirectUrl);
                        $(".raffle_content>div").hide().last().show().children('span:lt(1)').show();//立即抽奖可用
                        //$(".raffle_content>div").hide().last().children("span").show();//立即抽奖可用
                        if (H5LabaAct.IsFirstShow) { H5LabaAct.OpenBlackUI("domMessage4"); H5LabaAct.IsFirstShow = false };
                    } else {
                        $(".raffle_content>div").hide().first().show();//立即抽奖禁用
                        if (parseInt(data.Message) > 0) {
                            $(".bag_title").children().hide().eq(1).show();//横幅展示
                        } else {
                            $(".bag_title").children().hide().eq(2).show();//横幅展示
                        }
                    }
                }
                H5LabaAct.Fd_class(data.Message);
                $(".results_number>span").text(data.Message);
                setTimeout(function () { H5LabaAct.InitData(); }, 1000)
            }
        });
    },
    Fd_class: function (number) {
        if (parseInt(number) > 0) {
            H5LabaAct.IsCarryOut = true;
            $(".fudai_box>p").removeClass("split_bag_no").addClass("split_bag_yes");
        } else {
            $(".fudai_box>p").removeClass("split_bag_yes").addClass("split_bag_no");
           // $(".bag").removeAttr("id").hide();
        }
    },
    RandomCoin: function () {//随机八宝
        if (H5LabaAct.IsCarryOut) {
            H5LabaAct.IsCarryOut = false;
            ApiClient.Request({
                url: "/activities/randomcoin",
                type: "post",
                dataType: "json",
                success: function (data) {
                    console.log(data.Message);
                    if (data.Flag) {
                        $(".fudai_box p").addClass("sports");
                        $(".fudai_box>div").addClass("sports");
                        setTimeout(function () {
                            $(".bag").attr("id", "bag" + (parseInt(data.StausCode) + 1)).show();
                            $(".bag_content li").eq(data.StausCode).append("<p class='addOne'>+1</p>")
                            var thisImg = $(".bag_content li ").eq(data.StausCode).find("img");
                            var imgUrl = thisImg.attr("src");
                            thisImg.attr("src", imgUrl.replace("2", "1"));
                            $(".bag_content li ").eq(data.StausCode).find(".div0 img").addClass("dyn");
                            $(".fudai_box p").removeClass("sports");
                            $(".fudai_box>div").removeClass("sports");
                            setTimeout(function () {
                                $(".bag_content li ").eq(data.StausCode).find(".div0 img").removeClass("dyn");
                                $(".bag_content li ").eq(data.StausCode).find(".addOne").remove();
                                $(".bag").removeAttr("id").hide();
                            }, 1000);
                            var number = $(".bag_content li ").eq(data.StausCode).find("span");
                            number.removeClass().addClass("bag_spam_show");//.html("X" + (parseInt(number.text().substring(1)) + 1));
                            $(".bag_content li ").eq(data.StausCode).find(".addOne").animate({
                                "top": "-30%",
                                "opacity": "0",
                            }, 1000);
                            H5LabaAct.GamePlayNumber();
                        }, 1000);

                    } else {
                        console.log(data.Message)
                        H5LabaAct.GamePlayNumber();
                    }
                }
            });
        }
    },
    CotionDrow: function () {//八宝集齐抽奖
        if (H5LabaAct.IsDrow) {
            ApiClient.Request({
                url: "/activities/cotiondrow",
                type: "post",
                dataType: "json",
                success: function (data) {
                    if (data.Flag) {
                        switch (data.Message) {
                            case "88枚智币":
                                H5LabaAct.closeall();
                                H5LabaAct.OpenBlackUI("domMessage1");
                                break;
                            case "耐翔（NAENY）X10音响":
                                H5LabaAct.closeall();
                                H5LabaAct.OpenBlackUI("domMessage2");
                                break;
                            case "荣耀手环3(标准版)":
                                H5LabaAct.closeall();
                                H5LabaAct.OpenBlackUI("domMessage3");
                                break;
                        }
                    } else {
                        if (data.StausCode == "2") {
                            console.log("登录失效");
                            location.href = "/passport/login?returnurl=/act/LabaFestival";
                        }
                        console.log(data.Message);
                    }
                    H5LabaAct.Init();
                }
            });
        }
    },
    closeall: function () {
        $(".my_gift").hide();
        $("#mask").hide();
        $(".rules_box").hide();
        $(".draw_model").hide();
    },
    OpenBlackUI: function (DomeId) {
        $("#mask").show();
        $("#" + DomeId).show();
    },
    CloseBlackUI: function (DomeId) {
        $("#mask").hide();
        $("#" + DomeId).hide();
        return false;
    },
    DrawRostre: function () {
        if (!ApiClient.IsLogin()) {
            console.log("未登录");
        } else {
            $("#domMessage6>div>div").first().hide().next().show();
            ApiClient.Request({
                url: "/activities/drawrostre",
                type: "post",
                dataType: "json",
                success: function (data) {

                    var rolist = $("#gift_roList>ul");
                    rolist.children().remove();
                    if (data.length <= 0) {
                        rolist.html("<li><p class=\"nologoin\" >您还没有获得腊八大礼哦，<br />赶紧去参加活动！</p></li>")
                    }
                    else {
                        $.each(data, function (i, item) {
                            if (item.Item3 == 0) {
                                rolist.append("<li>" + item.Item1 + "，您获得了" + item.Item2 + "枚智币，奖励已到账，可至“<a href=\"/mall/index\" style=\"color:#007aff;\" >智币商城</a>“兑换礼品。</li>");
                            } else if (item.Item3 == 1) {
                                rolist.append("<li>" + item.Item1 + "，您获得了" + item.Item2 + "，请至“<a href=\"/act/myprize\" style=\"color:#007aff;\">我的奖品</a>”申请兑换。</li>");
                            }
                        });
                    }
                }
            });
        }
    },
}