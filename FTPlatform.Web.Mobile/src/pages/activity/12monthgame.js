//import Vue from 'vue'
//import * as client from '../../modules/ApiClient'

//var vm = new Vue({
//    el:'',
//});

/*--投掷筛子，产生点数---*/

var Sieve = function (el, fn) {

    this.locked = false;
    this.callback = null;
    this.$el = null;

    this.init = function (el, fn) {
        this.$el = el;
        this.callback = fn;
    }

    this.startMove = function (digit) {
        //if (this.locked)
        //    return;
        //this.lock();

        var self = this;
        this.$el.attr("class", "dice");
        this.$el.css('cursor', 'default');
        //var num = Math.floor(Math.random() * 6 + 1);//随机数1-6
        this.$el.animate({ left: '-2px' }, 100, function () {
            $(this).removeClass("dice_1").addClass("dice_2");
        }).delay(100).animate({ top: '2px' }, 100, function () {
            $(this).removeClass("dice_2").addClass("dice_5");
        }).delay(100).animate({ top: '-2px' }, 100, function () {
            $(this).removeClass("dice_5").addClass("dice_3");
        }).delay(100).animate({ left: '0' }, 100, function () {
            $(this).removeClass("dice_3").addClass("dice_4");
        }).delay(200).animate({ top: '2px' }, 300, function () {
            $(this).removeClass("dice_4").addClass("dice_6");
        }).delay(100).animate({ left: '0', top: '0px' }, 500, function () {
            $(this).removeClass("dice_6").addClass("dice_" + digit);
            $(this).css('cursor', 'pointer');

            if (typeof self.callback == "function") {
                self.callback(digit);
            }
        });
    }

    this.unlock = function () {
        this.locked = false;
    }

    this.lock = function () {
        this.locked = true;
    }

    this.init(el, fn)
}

var brugerAlert = function (opts) {
    var options = {
        el:'',
        type:'none',
        title: '',
        content: '',
        cancel: null,
        callbacks:null
            
        //confirm: { name: '', callback: function () { } },
    };
    $.extend(options, opts);

    //var dom = options.type == "none" ? $("#domMessage_5") : options.type == "winning" ? $("#domMessage11") : $("#domMessage16");
    var dom = $(options.el);

    if (options.title)
        dom.find(".model_title").text(options.title);
    //dom.find(".p_text .hint_P").text(options.content);
        
    $("#mask").show();
    dom.show();

    dom.find(".model_none").off("click").on("click", function () {
        dom.hide();
        $("#mask").hide();
        if (typeof opts.cancel == "function")
            opts.cancel();
    });
    //callback 1
    
    if (options.callbacks) {
        dom.off('click');
        dom.find(".model_btn").empty();
        for (var i = 0; i < options.callbacks.length; i++) {
            (function (i) {
                var btn_call = options.callbacks[i];
                var btnName = "btn_" + i;
                var btn = $('<a href="javascript:;" target="_blank" class="" id="' + btnName + '"></a>').text(btn_call.name);
                if (i >= 1) {
                    btn.addClass('giveUp');
                } else if (options.callbacks.length == 1) {
                    btn.addClass('confirm');
                }

                dom.on("click", "#" + btnName, function () {
                    dom.hide();
                    $("#mask").hide();
                    btn_call.callback();
                });
                dom.find(".model_btn").append(btn);
            })(i);
        }
    }

    $("#mask").off("click").on("click", function () {
        $(this).hide();
        dom.hide();
        if (typeof opts.cancel == "function")
            opts.cancel();
    });
}

//玩家 index：初始化火箭位置
var player = { id :1,balance:10000000,blockNumber:3,index:13};
var imageCache = loadImage(IMAGE_LIST, init);
var engine;
function init() {
    engine = new LudoGame({
        imageCache: imageCache,
        player: [player],
        sound: {
            open: true,
            audiosrc: '/Content/Image/activity/201712/audio/bg_music.mp3'
        }
    });
    //engine.play();

    var gameMove = function (digit) {
        engine.unlock();
        engine.go(player.id, digit, function (block) {
            
            var map = block.map;
            if (map.gift != 'gostart') {
                sieve.unlock();
            }

            if (block.type == "none") { //无中奖
                if (map.gift == "demand") {
                    brugerAlert({
                        el: '#domMessage_6',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '进入技术需求库', callback: function () { location.href = '/demand/' } }, { name: '发布需求', callback: function () { location.href = '/demand/publish' } }]
                    });
                } else if (map.gift == "expert") {
                    brugerAlert({
                        el: '#domMessage_8',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '进入技术资源库', callback: function () { location.href = '/expert/' } }, { name: '申请供方', callback: function () { location.href = '/expert/applysupplier' } }]
                    });
                } else if (map.gift == "cpmpanyService") {
                    brugerAlert({
                        el: '#domMessage_10',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '查看企业服务', callback: function () { location.href = '/unique/list/2' } }]
                    });
                } else if (map.gift == "unique") {
                    brugerAlert({
                        el: '#domMessage_7',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '众智绝活', callback: function () { location.href = '/unique/list/1' } }]
                    });
                } else if (map.gift == "mall") {
                    brugerAlert({
                        el: '#domMessage_9',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '智币商城', callback: function () { location.href = '/mall/' } }]
                    });
                } else if (map.gift == "highProduct") {
                    brugerAlert({
                        el: '#domMessage_11',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '购买工业精品', callback: function () { location.href = '/higharticle/' } }]
                    });
                } else if (map.gift == "informationService") {
                    brugerAlert({
                        el: '#domMessage_5',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{ name: '知识产权服务', callback: function () { location.href = '/unique/intellectualproperty' } }]
                    });
                }

            } else if (block.type == "winning") {//中奖
                if (map.gift == "iqiyi") {
                    brugerAlert({
                        el: '#domMessage15',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{
                        //    name: "领取奖品", callback: function () {
                        //        location.href = "/member/";
                        //    }
                        //}]
                    });
                } else if (map.gift == "30_virCurrency") {
                    brugerAlert({
                        el: '#domMessage16',
                        title: map.attr.name, content: map.attr.des,
                        //callbacks: [{
                        //    name: "确定", callback: function () {
                        //        //location.href = "/member/";
                        //    }
                        //}]
                    });
                } else if (map.gift == "100_virCurrency") {
                    brugerAlert({
                        el: '#domMessage14',
                        title: map.attr.name, content: map.attr.des, callbacks: [{
                            name: "确定", callback: function () {
                                //location.href = "/member/";
                            }
                        }]
                    });
                } else if (map.gift == "50_virCurrency") {
                    brugerAlert({
                        el: '#domMessage13',
                        title: map.attr.name, content: map.attr.des, callbacks: [{
                            name: "确定", callback: function () {
                                //location.href = "/member/";
                            }
                        }]
                    });
                } else if (map.gift == "mobile") {
                    //brugerAlert({
                    //    el: '#iphone',
                    //    title: map.attr.name, content: map.attr.des, callbacks: [{
                    //        name: "确定", callback: function () {
                    //            //location.href = "/member/";
                    //        }
                    //    }]
                    //});
                }
                else {
                    brugerAlert({
                        el: '#domMessage12',
                        title: map.attr.name, content: map.attr.des,
                        callbacks: [{
                            name: "确定", callback: function () {
                                //location.href = "/member/";
                            }
                        }]
                    });
                }

            } else if (block.type == "gostart") {//前往起点
                brugerAlert({
                    el: '#domMessage17',
                    title: map.attr.name, content: map.attr.des, cancel: function () {
                        engine.unlock();
                        engine.go(player.id, CONFIG.map.length - block.index, function () {
                            $('.role-image-start').show();
                            $('.role-image').remove();
                            engine.reload(13);
                            sieve.unlock();
                        });
                    }, callbacks: [{
                        name: "确定", callback: function () {
                            engine.unlock();
                            engine.go(player.id, CONFIG.map.length - block.index, function () {
                                $('.role-image-start').show();
                                $('.role-image').remove();
                                engine.reload(13);
                                sieve.unlock();
                            });
                        }
                    }]
                });
            }

        });
    }

    var sieve = new Sieve($('#roll_dice'), gameMove);

    $(document).on("click", "#roll_dice", function () {
        
        //var digit = Math.floor(Math.random() * 6) + 1;
        //sieve.startMove(digit);
        if (sieve.locked) {
            return;
        }
        sieve.lock();

        initPlayer();

        ApiClient.Request({
            url: '/activities/gamemoveramge',
            type: 'post',
            success: function (result) {
                if (!result) {
                    return;
                }

                if (result.Flag) {
                    $('.role-image-start').hide();

                    var Num = $("#zsz").html();
                    Num = parseInt(Num);
                    Num--;
                    $("#zsz").html(Num);

                    var dig = parseInt(result.StausCode);
                    sieve.startMove(dig);
                }
                else if (!result.Flag && result.StausCode == 1) {
                    alert('活动尚未开始，敬请期待');
                    sieve.unlock();
                } else if (!result.Flag && result.StausCode == 2) {
                    location.href = '/passport/login?return=' + encodeURIComponent('/activity/DecemberIndex');
                    sieve.unlock();
                } else if (!result.Flag && result.StausCode == 3) {
                    sieve.unlock();
                    $(".refereecode").attr('href', '/passport/register/' + ApiClient.GetCurrentUser().UserName)
                    brugerAlert({
                        el: '#UnJiHui',
                        callbacks: [{
                            name: '智币兑换', callback: function () {
                                ApiClient.Request({
                                    url: '/activities/gamebuynumber',
                                    type: 'post',
                                    success: function (result) {
                                        if (!result) {
                                            return;
                                        }

                                        if (result.Flag) {
                                            brugerAlert({
                                                el: '#dhSuccess',
                                                callbacks: [{
                                                    name: '确定', callback: function () {
                                                    }
                                                }]
                                            });
                                            var Num = $("#zsz").html();
                                            Num = parseInt(Num);
                                            Num++;
                                            $("#zsz").html(Num);

                                        } else if (!result.Flag && result.StausCode == '1') {
                                            location.href = '/passport/login?return=' + encodeURIComponent('/activity/DecemberIndex');
                                        } else if (!result.Flag && result.StausCode == '2') {
                                            alert('活动尚未开始，敬请期待');
                                        } else if (!result.Flag && result.StausCode == '3') {
                                            $(".refereecode").attr('href', '/passport/register/' + ApiClient.GetCurrentUser().UserName)
                                            brugerAlert({
                                                el: '#dhError',
                                                //callbacks: [{ name: '确定', callback: function () { } }]
                                            });

                                        }

                                    }
                                });
                            }
                        }, { name: '放弃', callback: function () { } }]
                    });
                    
                }
            }
        });

    });

}

function initPlayer(){
    ApiClient.Request({
        url: '/activities/rocketseat',
        type: 'post',
        success: function (result) {
            if (result) {
                var digit = parseInt(result);
                if (digit != 13)
                    engine.reload(digit);

            }
        }
    });
}

function loadUserPrice() {
    ApiClient.Request({
        url: '/activities/drawrostre',
        type: 'post',
        success: function (result) {
            $(".myPirze_content").empty();
            var strHtml = '';
            if (!result || result.length == 0) {
                strHtml = '<li>还没有中奖哦，赶紧去参加活动</li>';
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].Item3 == '0')
                    strHtml += '<li>' + result[i].Item1 + '，您获得了<span>' + result[i].Item2 + '枚</span>智币，请至<span><a href="/mall/"  target="_blank">“智币商城”</a></span>兑换礼品</li>';
                else if (result[i].Item3 == '2')
                    strHtml += '<li>' + result[i].Item1 + '，您获得了<span>' + result[i].Item2 + '元</span>话费，请至<span><a href="/act/myprize" target="_blank">“我的奖品”</a></span>申请兑换</li>';
                else if (result[i].Item3 == '3')
                    strHtml += '<li>' + result[i].Item1 + '，您获得了<span>' + result[i].Item2 + '</span>，请至<span><a href="/act/myprize" target="_blank">“我的奖品”</a></span>申请兑换</li>';
                else
                    strHtml += '<li>' + result[i].Item1 + '，您获得了<span>' + result[i].Item2 + '</span>，请至<span><a href="/act/myprize" target="_blank">“我的奖品”</a></span>申请兑换</li>';

            }
            $(".myPirze_content").append(strHtml)
        }
    });
}

jQuery(function ($) {
    
    //雪花
    $(".snow-canvas").snow();

    //是否登录
    if (ApiClient.IsLogin()) {
        $(".see_prize").show();
        $(".see_prize").off('click').on('click', function () {
            //$("#mask").show();
            //$(".myPirze_box").show();
            brugerAlert({
                el: '.myPirze_box',
                //callbacks: [{ name: '进入技术需求库', callback: function () { location.href = '/demand/' } }, { name: '发布需求', callback: function () { location.href = '/demand/publish' } }]
            });

            loadUserPrice();

        });

        loadUserPrice();

        initPlayer();
    }

    //查看奖品
    //$(".see_prize").click(function () {
    //    $("#mask").show();
    //    $(".myPirze_box").show();
    //});

    //隐藏查看个人奖品
    $(".myPirze_box .model_none").click(function () {
        $("#mask").hide();
        $(".myPirze_box").hide();
    });

    /*--登录与未登录--*/
    $("#logoin_box").on("click", function () {
        var Num = 0;
        if (ApiClient.IsLogin()) {
            $(".no_logoin").hide();
            $(".loginSuccess").show();

            //加载剩余次数
            ApiClient.Request({
                url: '/activities/gameplaynumber',
                type: 'post',
                success: function (result) {
                    if (!result) {
                        return;
                    }

                    Num = result;
                    $("#zsz").html(result);
                }
            });

            ///兑换次数
            $(".logoin_btn").off("click").on("click", function () {
                brugerAlert({
                    el: '#dhdomMessage',
                    callbacks: [{
                        name: '智币兑换', callback: function () {
                            ApiClient.Request({
                                url: '/activities/gamebuynumber',
                                type: 'post',
                                success: function (result) {
                                    if (!result) {
                                        return;
                                    }

                                    if (result.Flag) {
                                        brugerAlert({
                                            el: '#dhSuccess',
                                            callbacks: [{ name: '确定', callback: function () {  } }]
                                        });

                                        var Num = $("#zsz").html();
                                        Num = parseInt(Num);
                                        Num++;
                                        $("#zsz").html(Num);
                                    } else if (!result.Flag && result.StausCode == '1') {
                                        location.href = '/passport/login?return=' + encodeURIComponent('/activity/DecemberIndex');
                                    } else if (!result.Flag && result.StausCode == '2') {
                                        alert('活动尚未开始，敬请期待');
                                    } else if (!result.Flag && result.StausCode == '3') {
                                        $(".refereecode").attr('href', '/passport/register/' + ApiClient.GetCurrentUser().UserName)
                                        brugerAlert({
                                            el: '#dhError',
                                            //callbacks: [{ name: '确定', callback: function () { } }]
                                        });

                                    }

                                }
                            });
                        }
                    }, { name: '放弃', callback: function () { } }]

                });


            });

        } else {
            brugerAlert({
                el: '#logindomMessage',
                callbacks: [{ name: '前往登录', callback: function () { location.href = '/passport/login?returnurl=' + encodeURIComponent('/activity/DecemberIndex'); } }, { name: '取消', callback: function () { } }]
            });
            //alert("请先登录！");
            $(".loginSuccess").hide();
        }
    });

    /*----活动说明---*/
    $(".hint_box").on("click", function () {
        //$("#mask").show();
        //$(".actInstruction_box").show();
        brugerAlert({
            el: '.actInstruction_box',
            //callbacks: [{ name: '确定', callback: function () { } }]
        });

    });
    $(".actInstruction_box .model_none").on("click", function () {
        $(".actInstruction_box").hide();
        $("#mask").hide();
    })

});