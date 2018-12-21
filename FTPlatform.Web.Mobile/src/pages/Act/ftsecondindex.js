import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import * as StatusService from '../../modules/StatusService'
import { Toast } from 'mint-ui'
import { GetIdFromUrl } from '../../modules/UrlService'
import { Popup } from 'mint-ui';
import share from '../../components/share/Share.vue'

Vue.component(Popup.name, Popup);
var vm = new Vue({
    el: '#act',
    components: {
        share
    },
    data: {
        inertval:'',
        ActId:0,
        popupVisible:false,
        textMessage:"",
        PopupUrl:"",
        ActOpenType:"0",//1-未开始，2-已结束未出奖，3-已结束已出奖
    },
    created: function () {
        $('#description')[0].content = "飞天众智两周年庆震撼来袭！邀您一起大狂欢！我们为您准备了多重惊喜，赶快加入，庆典开启，豪礼送不停！Ready Go！";
        this.InitActId();
        $(".span_colse").click(function(){
            var divid=$(this).parent().attr("id");
            vm.IsOpenWindow(divid,false);
            if(!$(".mui-content").hasClass("l-scrollable")){
                $(this).addClass("l-scrollable");
            }
        });
    },
    methods: {
        SharePage: function () {
            this.$refs.share.Show()
        },
        Show: function () {
            var _data=this;
            _data.popupVisible=true;
        },
        Close:function(){
            var _data=this;
            _data.popupVisible=false;
        },
        NeedLogin: function (type) {
            var _data=this;
            _data.textMessage = '登录后继续，是否登录？'
            var returnurl = ''
            switch (type) {
                case 1:
                    returnurl = encodeURIComponent('/demand/publish')
                    break
                case 2:
                    returnurl = encodeURIComponent('/expert/applysupplier')
                    break
                case 3:
                    returnurl = encodeURIComponent('/techshare/publish')
                    break
            }
            _data.PopupUrl = '/passport/login?returnurl=' + returnurl // encodeURIComponent(isDemand ? '/demand/publish' : '/techshare/publish');
            this.Show()
        },
        NeedCompleteInfo: function (type) {
            var _data=this;
            _data.textMessage = '请先完善个人信息，是否现在完善？'
            var returnurl = ''
            switch (type) {
                case 1:
                    returnurl = encodeURIComponent('/demand/publish')
                    break
                case 2:
                    returnurl = encodeURIComponent('/expert/applysupplier')
                    break
                case 3:
                    returnurl = encodeURIComponent('/techshare/publish')
            }
            _data.PopupUrl = '/mybusiness/basicinformation?returnurl=' + returnurl // encodeURIComponent(isDemand ? '/demand/publish' : '/techshare/publish':'/patent/publish');
            _data.Show()
        },
        InitActId:function(){
            var _data = this;
            $.ajax({  
                url: '/Content/js/Pages/Act/ActGather.xml',  
                type: 'GET',  
                dataType: 'xml',  
                timeout: 1000,  
                cache: false,  
                error: function(xml) {  
                    $("#z_text").html("活动数据加载出错");
                    _data.IsOpenWindow("pop_message",true);
                },  
                success: _data.Init,
            }); 
        },
        PublishTech: function () {
            var self = this
            if (client.IsLogin()) {
                client.Request({
                    type: 'get',
                    url: '/user/complete',
                    success: function (res) {
                        if (res.err_code == '401') {
                            self.NeedLogin(3)
                        } else if (res.data == 0) {
                            self.NeedCompleteInfo(3)
                        } else {
                            window.location.href = '/techshare/publish'
                        }
                    }
                })
            } else {
                self.IsOpenWindow("pop_one",true);
            }
        }, 
        IsOkUrl:function(){
            var   _data=this;
            location.href=_data.PopupUrl;
        },
        PublishApply: function () {
            var self = this
            if (client.IsLogin()) {
                client.Request({
                    type: 'get',
                    url: '/user/complete',
                    success: function (res) {
                        if (res.err_code == '401') {
                            self.NeedLogin(2)
                        } else if (res.data == 0) {
                            self.NeedCompleteInfo(2)
                        } else {
                            window.location.href = '/expert/applysupplier'
                        }
                    }
                })
            } else {
                self.IsOpenWindow("pop_one",true);
            }
        },
        PublishDemand: function () {
            var self = this
            if (client.IsLogin()) {
                client.Request({
                    type: 'get',
                    url: '/user/complete',
                    success: function (res) {
                        if (res.err_code == '401') {
                            self.NeedLogin(1)
                        } else if (res.data == 0) {
                            self.NeedCompleteInfo(1)
                        } else {
                            window.location.href = '/demand/publish'
                        }
                    }
                })
            } else {
                self.IsOpenWindow("pop_one",true);
            }
        },
        Init:function(data){
            var _data=this;
            _data.ActId=  $(data).find('Activity').first().children('ActId').text();
            var _DiscusStartTime=  $(data).find('Activity').first().children('DiscusStartTime').text();
            var _DiscusStopTime=  $(data).find('Activity').first().children('DiscusStopTime').text();
            client.Request({
                type: 'post',
                url: "/activities/actmodel?ActId="+_data.ActId,
                success: function (datas) {
                    if(datas.hasOwnProperty('err_msg')){
                        $("#z_text").html(datas.err_msg);
                        _data.IsOpenWindow("pop_message",true);
                        return;
                    }
                    var ddate=new Date();
                    var actStart=new Date(datas.StartTime.replace(/T/g," ").replace(/-/g,"/"));
                    var date=new Date(datas.TerminationTime.replace(/T/g," ").replace(/-/g,"/"));
                    if(ddate<actStart){//未开始
                        _data.ActOpenType="1";
                        $("#z_text").html("活动暂未开始！</br>");
                        _data.IsOpenWindow("pop_message",true);
                        return;
                    }else if(ddate>date){//结束
                        var discussDate1 = new Date(_DiscusStartTime);
                        var discussDate2 = new Date(_DiscusStopTime);
                        if (ddate > discussDate1 && ddate < discussDate2) {//评选中
                            _data.ActOpenType="2";
                            $("#pop_two p.pop_text").html("获奖者还在评选中，12月6日18点将揭晓中奖名单，敬请期待！");
                            _data.IsOpenWindow("pop_two",true);
                        } else if (ddate > discussDate2) {//中奖结果
                            _data.ActOpenType="3";
                            _data.IsOpenWindow("draw_show",true);
                        }
                        console.log("活动已结束");
                        return;
                    }
                    var year=  date.getFullYear();
                    var month= (parseInt(date.getMonth())+1);
                    var day=   date.getDate();
                    var hour=   date.getHours();
                    var minute=   date.getMinutes();
                    var second=   date.getSeconds();
                    var leftTimes = (new Date(year, (parseInt(month) - 1), day, hour, minute, second)) //- (new Date()); //毫秒数
                    _data.inertval = setInterval(function(){
                        var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); //毫秒数
                        var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //天数
                        var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //小时
                        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//分钟
                        var seconds = parseInt(leftTime / 1000 % 60, 10);//秒数
                        hours = _data.checkTime(hours + (days * 24));
                        minutes = _data.checkTime(minutes);
                        seconds = _data.checkTime(seconds);
                        if (hours == "00" && minutes == "00" && seconds == "00" || leftTime < 0) {
                            clearInterval(_data.inertval);
                            hours = "00";
                            minutes = "00";
                            seconds = "00";
                            _data.ActOpenType="2";
                            $("#pop_two p.pop_text").html("获奖者还在评选中，12月6日18点将揭晓中奖名单，敬请期待！");
                            _data.IsOpenWindow("pop_two",true);
                        }
                        $("#timer").html("投票剩余时间：<span>" + hours + "</span>小时<span>" + minutes + "</span>分<span>" + seconds + "</span>秒");
                    }, 100);
                },
                complete: function () {
                }
            })
        },
        checkTime:function(i){
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        IsLogin:function(){
            var _data=this;
            switch (_data.ActOpenType) {
                case "0":
                    if(!client.IsLogin()){
                        _data.IsOpenWindow("pop_one",true);
                    }else {
                        location.href="/act/ftsuccess"
                    }
                    break;
                case "1":
                    $("#z_text").html("活动暂未开始！</br>");
                    _data.IsOpenWindow("pop_message",true);
                    break;
                case "2":
                    $("#pop_two p.pop_text").html("获奖者还在评选中，12月6日18点将揭晓中奖名单，敬请期待！");
                    _data.IsOpenWindow("pop_two",true);
                    break;
                case "3":
                    _data.IsOpenWindow("draw_show",true);
                    break;
        
            }
        },
        IsOpenWindow:function(Vid,IsNo){
            if(IsNo){
                $("#"+Vid).show();
                $("#mask").show();
                if($(".mui-content").hasClass("l-scrollable")){
                    $(this).removeClass("l-scrollable");
                }
            }else {
                $("#"+Vid).hide();
                $("#mask").hide();
                if(!$(".mui-content").hasClass("l-scrollable")){
                    $(this).addClass("l-scrollable");
                }
            }
        },
        RegisterDecide:function(){
            var _data=this;
            if(!client.IsLogin()){
                location.href="/passport/register";
            }else {
                $("#z_text").html("不能重复注册!");
                _data.IsOpenWindow("pop_message",true);
            }
        },
        MyPrizeUrl:function(){
            if(!client.IsLogin()){
                location.href="/passport/login?returnurl=" + encodeURIComponent('/act/myprize');
            }else {
                location.href= "/act/myprize";
            }
        },
    },
    filters: {
       
    },
});