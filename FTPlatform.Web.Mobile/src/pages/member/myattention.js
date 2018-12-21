import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import {Toast} from "mint-ui";

var localdata = StorageService.Get("MyAttention");
localdata = localdata || {};
function appendDone() {
    return;
}
function RefreshDone() {
    return;
}
Vue.filter('status', function (val) {
    if (val == 1)
        return "待审核";
    if (val == 2)
        return "已发布";
    if (val == 3)
        return "对接中";
    if (val == 4)
        return "合同待审核";
    if (val == 5 || val == 7 || val == 16)
        return "项目进行中";
    if (val == 8)
        return "项目完成";
    if (val == 9)
        return "已评价";
    if (val == 10)
        return "已终止";
    if (val == 21)
        return "未通过审核";
    if (val == 22)
        return "合同已拒绝";
    if (val == 99)
        return "待提交";
})
Vue.filter('cs', function (val) {
    switch (val) {
        case 0:
            return "待确认";
            break;
        case 1:
            return "已交换";
            break;
        case -1:
            return "已拒绝";
            break;
        case 100:
            return "未交换";
            break;
        default:
            return "未交换";
            break;
    }
})
Vue.filter("num", function (val) {
    if (val != null)
        return val.length;
    else
        return 0;
})
Vue.filter("length", function (val) {
    if (val.length > 9)
        return val.substring(0, 9) + "...";
    else
        return val;
})
Vue.filter('formatDate', function (value) {
    if (value != null && value != "") {
        return value.substring(0, 10);
    }
});
Vue.filter('removeHTMLTag', function (str) {
    if (str != null && str != "" & str != undefined) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/ /ig, '');//去掉
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/\s/g, "");
        return str;
    }
});
var MyAttention = new Vue({   
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        DemandAttention: [],
        ExpertAttention: [],
        TechAttention:[],
        InputBudget: ["<1万", "1~10万", "10~15万", "50~200万", ">200万", ],
        isloading: false,
        param: { type:0,pageIndex: 1},
    },
    methods: {
        isLogin:function(){
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fmyattention';
                return;
            }
        },           
        EUnFollow: function(id){
            if (!client.IsLogin())
            {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fmyattention';
                return;
            }
            var self = this;
            client.Request({
                type: "get",
                url: '/expert/attentionexpert?expertid=' + id,
                success: function (result) {
                    if (result.Flag) {
                        self.Refresh();
                        Toast({message:result.Message,duration:1000});
                       
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            })},
        TUnFollow:  function (id) {
            if (!client.IsLogin()) {
                location.href = '/passport/login?returnurl=%2Fmybusiness%2Fmyattention';
                return;
            }
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.techunfollow + '?id=' + id,
                success: function (result) {
                    if (result.Flag) {
                        self.Refresh();
                        Toast({message:result.Message,duration:1000});
                    }
                    else {
                        Toast({message:result.Message,duration:1000});
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            })
        },
        DemandDetail: function (id) {
            location.href = '/demand/detail/' + id;
        },
        ExpertDetail: function (id) {
            location.href = '/expert/detail/' + id;
        },
        TechDetail: function (id) {
            location.href = '/techshare/detail/' + id;
        },
        Refresh: function (done) {
            var self = this;
            if (self.$data.isloading)
            {
                self.$refs.scroller.finishPullToRefresh();
                return;
            }                    
                  
            RefreshDone = done;
            self.isLogin();                    
            self.$data.param.pageIndex = 1;
            self.isloading = true;
            client.Request({
                type: "get",
                url: client.Api.myattention,
                data: self.$data.param,
                success: function (result) {
                    if (result.err_code)
                    {                               
                        self.$refs.scroller.finishPullToRefresh();
                        return;
                    }
                    self.DemandAttention = [];
                    self.ExpertAttention = [];
                    self.TechAttention = [];
                    for (var i = 0; i < result.DemandAttention.length; i++)
                        self.$data.DemandAttention.push(result.DemandAttention[i]);
                    for (var i = 0; i < result.ExpertAttention.length; i++)
                        self.$data.ExpertAttention.push(result.ExpertAttention[i]);
                    for (var i = 0; i < result.TechAttention.length; i++)
                        self.$data.TechAttention.push(result.TechAttention[i]);
                        
                },
                complete: function (XMLHttpRequest, textStatus) { 
                    self.$data.isloading = false; 
                    self.$refs.scroller.finishPullToRefresh();
                },
                error: function () {
                    self.$refs.scroller.finishPullToRefresh();
                    self.$data.isloading = false;  
                }
            })
        },
        Append: function (done) {
            var noMore = false;
            appendDone = done;                   
            var self = this;
            if (self.$data.isloading) {
                if (appendDone) {
                    appendDone();
                }
                return;
            }              
            if( self.$data.DemandAttention.length||self.$data.ExpertAttention.length||self.$data.TechAttention.length)
                self.$data.param.pageIndex += 1;
            else
                self.$data.param.pageIndex = 1;
            self.$data.isloading = true;
            client.Request({
                type: "get",
                url: client.Api.myattention,
                data: self.$data.param,
                success: function (result) {
                    if (result.err_code) {
                        noMore = true;
                    }
                    else {
                        if (result.DemandAttention.length == 0 && result.ExpertAttention.length == 0 && result.TechAttention.length == 0)
                            noMore = true;
                        for (var i = 0; i < result.DemandAttention.length; i++)
                            self.$data.DemandAttention.push(result.DemandAttention[i]);
                        for (var i = 0; i < result.ExpertAttention.length; i++)
                            self.$data.ExpertAttention.push(result.ExpertAttention[i]);
                        for (var i = 0; i < result.TechAttention.length; i++)
                            self.$data.TechAttention.push(result.TechAttention[i]);
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        noMore = true;
                 
                    self.$data.isloading = false;                         
                    self.$refs.scroller.finishInfinite(2);
                    appendDone(noMore)
                },
                error:function(){
                    self.$refs.scroller.finishInfinite(2);
                    self.$data.isloading = false;  
                }
            })
                   
                                   
        }
    },
})

$(function(){
    $(".attention li").click(function(){
        MyAttention.$data.param.type=$(this).index()
        MyAttention.$refs.scroller.scrollTo(0, 0);
        MyAttention.$refs.scroller.triggerPullToRefresh();
        $(this).addClass("text_color").siblings().removeClass("text_color");
        $(".problem").css("display", "none").eq($(this).index()).css("display", "block");
    });
})

