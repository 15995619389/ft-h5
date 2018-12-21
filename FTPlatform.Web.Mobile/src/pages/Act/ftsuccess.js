import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import * as StatusService from '../../modules/StatusService'
import { Toast } from 'mint-ui'
import { GetIdFromUrl } from '../../modules/UrlService'
import share from '../../components/share/Share.vue'

var vm = new Vue({
    el: '#act',
    components: {
        share
    },
    data: {
        inertval:'',
        ActId:0,
        ActNewsModels:[],
        TickCaseCode:0,//投票案例code
    },
    created: function () {
        $('#description')[0].content = "动动手指参与“最优秀案例”投票，爱奇艺VIP年卡带回家";
        this.InitActId();
        this.DataInit();
    },
    methods: {
        SharePage: function () {
            this.$refs.share.Show()
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
                    _data.IsOpenWindow("pop_one_add",true);
                },  
                success: _data.Init
            }); 
        },
        Init:function(data){
            var _data=this;
            _data.ActId=  $(data).find('Activity').first().children('ActId').text();
            client.Request({
                type: 'post',
                url: "/activities/actmodel?ActId="+_data.ActId,
                success: function (datas) {
                    if(datas.hasOwnProperty('err_msg')){
                        $("#z_text").html(datas.err_msg);
                        _data.IsOpenWindow("pop_one_add",true);
                        return;
                    }
                    var ddate=new Date();
                    var actStart=new Date(datas.StartTime.replace(/T/g," ").replace(/-/g,"/"));
                    var date=new Date(datas.TerminationTime.replace(/T/g," ").replace(/-/g,"/"));
                    if(ddate<actStart){//未开始
                        $("#z_text").html("活动暂未开始！</br></br>");
                        _data.IsOpenWindow("pop_one_add",true);
                        return;
                    }else if(ddate>date){
                        $("#z_text").html("活动已结束！</br></br>");
                        _data.IsOpenWindow("pop_one_add",true);
                        return;
                    }
                    var year=  date.getFullYear();
                    var month=   date.getMonth()+1;
                    var day=   date.getDate();
                    var hour=   date.getHours();
                    var minute=   date.getMinutes();
                    var second=   date.getSeconds();
                    _data.inertval = setInterval(function(){
                        var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); //毫秒数
                        var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //天数
                        var hours = parseInt(parseInt(leftTime) / 1000 / 60 / 60 % 24, 10); //小时
                        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//分钟
                        var seconds = parseInt(leftTime / 1000 % 60, 10);//秒数
                        //days = checkTime(days);
                        hours = _data.checkTime(hours + (days * 24));
                        minutes = _data.checkTime(minutes);
                        seconds = _data.checkTime(seconds);
                        if (hours == "00" && minutes == "00" && seconds == "00" || leftTime < 0) {
                            clearInterval(_data.inertval);
                            hours = "00";
                            minutes = "00";
                            seconds = "00";
                            //alert("停止");
                        }
                        $("#timer").html("投票剩余时间：<span>" + hours + "</span>小时<span>" + minutes + "</span>分<span>" + seconds + "</span>秒");
                        
                    }, 100);
                },
            });
        },
        DataInit:function(){
            var _data=this;
            client.Request({
                type: 'post',
                url: "/activities/initdata",
                success: function (data) {
                    if(data.hasOwnProperty('err_msg')){
                        alert(data.err_msg);
                        return;
                    }
                    _data.ActNewsModels=data;
                },
            });
        },
        checkTime:function(i){
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        IsOpenWindow:function(Vid,IsNo){
            if(IsNo){               
                $("#"+Vid).show();
                $("#mask").show();
                if($(".mui-content").hasClass("l-scrollable")){
                    $(".mui-content").removeClass("l-scrollable");
                }
            }else {
                $("#"+Vid).hide();
                $("#mask").hide();
                if(!$(".mui-content").hasClass("l-scrollable")){
                    $(".mui-content").addClass("l-scrollable");
                }
            }
        },
        ActUserVoteConfirm:function(code){//提示消耗
            var  _data=this;
            if(!client.IsLogin()){
                _data.IsOpenWindow("pop_one",true);
                return;
            }else {
                client.Request({
                    type: 'post',
                    url: "/activities/checknumber?ActId="+_data.ActId,
                    success: function (data) {
                        if(parseInt(data)>0){
                            _data.IsOpenWindow("pop_three",true);
                            _data.TickCaseCode=code;
                        }else {
                            // _data.IsOpenWindow("pop_three",false);
                            _data.IsOpenWindow("pop_six",true);
                        }
                    }
                });
            }
           
        },
        ActUserVoteYes:function(){
            var _data=this;
            client.Request({
                type: 'post',
                url: "/activities/actuservote?NewsId="+_data.TickCaseCode+"&ActId="+_data.ActId,
                success: function (data) {
                    if(data.Flag){
                        switch (data.StausCode) {
                            case "0":
                                _data.IsOpenWindow("pop_three",false);
                                _data.IsOpenWindow("pop_five",true);//无投票机会
                                break;
                            case "1":
                                _data.IsOpenWindow("pop_three",false);
                                _data.IsOpenWindow("pop_four",true);//剩余一次
                                break;
                            default:
                                _data.IsOpenWindow("pop_three",false);
                                $("#z_text").text(data.Message);
                                _data.IsOpenWindow("pop_one_add",true);
                                break;
                        }
                        _data.DataInit();
                    }else {
                        switch (data.StausCode) {
                            case "1":
                            case "2":
                            case "4":
                                _data.IsOpenWindow("pop_three",false);
                                $("#z_text").text(data.Message);
                                _data.IsOpenWindow("pop_one_add",true);
                                break;
                            case "3":
                                _data.IsOpenWindow("pop_three",false);
                                _data.IsOpenWindow("pop_one",true);
                                break;
                            case "5":
                                _data.IsOpenWindow("pop_three",false);
                                _data.IsOpenWindow("pop_six",true);
                                break;
                            default:
                                _data.IsOpenWindow("pop_three",false);
                                $("#z_text").text(data.Message);
                                _data.IsOpenWindow("pop_one_add",true);
                                break;
                        }
                    }
                }
            });
        },
    },
    filters: {
       
    },
})