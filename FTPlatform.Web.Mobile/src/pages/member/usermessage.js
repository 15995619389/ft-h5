import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";
import {Toast} from "mint-ui";
function appendDone() {
    return;
}
var UserMessage = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        UserMessage:[],              
        param: { msgType: 0, pageIndex: 1, pageSize: 10 },
        isloading:false,
    },

    methods: {
        Refresh: function () {
            var data = this.$data;
            data.param.pageIndex = 1;
            data.isloading = true;        
            var self = this;
            client.Request({
                type: "get",
                data:data.param,
                url:client.Api.usermessage,
                success: function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Content.indexOf("/Demand/Detail/") > 0)
                            result[i].Content = result[i].Content.replace("/Demand/Detail/", "/Demand/PublishDemandDetail/");
                        if (result[i].Content.indexOf("/Demand/Show/") > 0) {
                            result[i].Content = result[i].Content.replace("Show", "Detail");
                        }                               
                        if (result[i].Url != null) {
                            if (result[i].Url.indexOf("Demand/Detail/") > -1) {                                       
                                result[i].Url = result[i].Url.replace("Detail", "PublishDemandDetail");
                            }
                            if (result[i].Url.indexOf("Demand/Show/") > -1)
                                result[i].Url = result[i].Url.replace("Show", "Detail");
                        }
                    }
                    data.UserMessage = result;
                          
                },
                complete: function (XMLHttpRequest, textStatus) {
                 
                    self.$data.isloading = false;
                    self.$refs.scroller.finishPullToRefresh();
                    window.setTimeout($.proxy(function () {
                        read_a();
                    }, this), 100);
                }
            })
        },
        Append:function(done){
            var data = this.$data;
            var noMore = false;
            appendDone = done;
            if (data.isloading) {
                if (appendDone) {
                    appendDone();
                }
                return;
            }
            data.isloading = true;
            if(data.UserMessage.length)
                data.param.pageIndex += 1;
            else
                data.param.pageIndex=1;
            var self = this;
            client.Request({
                type: "get",
                data: data.param,
                url:client.Api.usermessage,
                success: function (result) {
                    if (result.length == 0)
                        noMore = true;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Content.indexOf("/Demand/Detail/") > -1)
                            result[i].Content = result[i].Content.replace("/Demand/Detail/", "/Demand/PublishDemandDetail/");
                        if (result[i].Content.indexOf("/Demand/Show/") > -1) {
                            result[i].Content = result[i].Content.replace("Show", "Detail");
                        }                               
                        if (result[i].Url != null) {
                            if (result[i].Url.indexOf("Demand/Detail/") > -1) {
                                result[i].Url = result[i].Url.replace("Detail", "PublishDemandDetail");
                            }
                            if (result[i].Url.indexOf("Demand/Show/") > -1)
                                result[i].Url = result[i].Url.replace("Show", "Detail");
                        }
                        data.UserMessage.push(result[i])                               
                    }                            
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        noMore = true;
                    self.$data.isloading = false;
                    self.$refs.scroller.finishInfinite(2);
                    appendDone(noMore);
                    window.setTimeout($.proxy(function () {
                        read_a();
                    }, this), 100);
                }
            })
        },
        ChangeType: function (id) {
            var data = this.$data;
            var self = this;
            data.param.msgType = id;
            self.Refresh();
        },
        ReadMessage: function (um) {
            var self=this;
            if (um.Status != 1) {
                client.Request({
                    type: "post",
                    url: "/my/readmessage?id=" + um.Id,
                    success: function () {
                    },
                    complete: function () {
                        if (um.MessageType!=3)
                            self.Look(um)
                    }

                })
            }
            else
                self.Look(um);
        },              
        Look: function (um) {                          
            if (um.MessageType == 4) {
                um.Remark = um.Remark.toLowerCase();
                if (um.Remark.indexOf("\"demandid\":") > -1) {
                    var demandid = um.Remark.substring(um.Remark.indexOf("\"demandid\":") + 11, um.Remark.length - 1);
                    location.href = '/demand/publishdemanddetail/' + demandid;
                }
                else
                    location.href = um.Url;
            }
            if (um.MessageType == 5)
                location.href = '/expert/expersolutiondemand';
            if (um.MessageType == 2 || um.MessageType == 6||um.MessageType==3) {
                var userid = um.Remark.substring(um.Remark.indexOf("\"userId\":") + 9, um.Remark.length - 1);
                var id = parseInt(userid);
                if (id != "NoN")
                    location.href = '/mybusiness/mycarte/' + id;
            }
            return;
        },                
        Receive:  function (um) {
            var self = this;
        
            var exid = um.Remark.substring(um.Remark.indexOf("\"CarteExchangeId\":") + 18, um.Remark.length - 1);
            var id = parseInt(exid);
            client.Request({
                type: "post",
                url:client.Api.cartereceive + '?id=' + id,
                success: function (result) {
                    if (result.Flag) {
                        self.ReadMessage(um);
                        self.Refresh();                               
                    }
                    Toast({message:result.Message,duration:1000});
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});

                }
            })
                  
        },
        ReJect: function (um) {
            var self = this;
            var userid = um.Remark.substring(um.Remark.indexOf("\"CarteExchangeId\":") + 18, um.Remark.length - 1);
            var id = parseInt(userid);
            client.Request({
                type: "post",
                url:client.Api.cartereject + '?id=' + id,
                success: function (result) {
                    if (result.Flag) {
                        self.ReadMessage(um);
                        self.Refresh();
                        Toast({message:result.Message,duration:1000});
                    }
                },
                error: function (result) {
                    Toast({message:result.Message,duration:1000});
                }
            })                    
        },
            
    }
})
function read_a() {
    $(".mui-ellipsis a").click(function () {
        var id = $(this).parent().parent().attr("id");
        var href = $(this).attr("href");
        client.Request({
            type: "post",
            url: "/my/readmessage?id=" + id,
            success: function () {
            },
            complete: function () {
                location.href = href;
            }
        })
        return false;
    })
}    
$(function () {
    if (!client.IsLogin())
    {
        location.href = '/passport/login?returnurl=%2Fmybusiness%2Fusermessage';
        return;
    }
})
var show = true;
$(function () {  
    $(".mui-content .content_nav .right_iocn").click(function () {
        $(".mui-content .content_nav li").removeClass("text_color");
        $(".mui-content .allProject").fadeToggle("slow");
        if(show)
            $("._v-content").css("margin-top", "130px")
        else
            $("._v-content").css("margin-top", "90px")
        show=!show
    })
})
$(function () {
    $(".mui-content .content_nav li").click(function () {
        $(".mui-content .allProject").hide();
        if (!show) {
            show = !show;
        }
        $("._v-content").css("margin-top", "90px");
        $(".mui-content .allProject li").removeClass("text_color");
        $(this).addClass("text_color").siblings().removeClass("text_color");
        UserMessage.$refs.scroller.scrollTo(0, 0);
    })
})
$(function () {
    $(".mui-content .allProject li").click(function () {
        $(".mui-content .content_nav li").removeClass("text_color");
        $(this).addClass("text_color").siblings().removeClass("text_color");
        UserMessage.$refs.scroller.scrollTo(0, 0);
    })

  
    $('._v-content').css("margin-top", "90px");
})