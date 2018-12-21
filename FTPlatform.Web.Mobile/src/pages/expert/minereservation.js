import * as StorageService from "../../modules/StorageService";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import Vue from "vue";



function appendDone() {
    return;
}
var MR = new Vue({
    el: '.mui-content',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        param: { pageindex: 1, pagesize: 15 },
        loading: false,
        MineReservation: [],
        ReservationMe: [],
    },
    methods: {    
       Refresh: function () {
            var data = this.$data;           
            var self = this;
            data.param.pageindex = 1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.minereservation,
                success: function (result) {
                    if ($('.text_color').attr("value") == 0)
                        data.ReservationMe=result.ReservationMine;
                    if ($('.text_color').attr("value") == 1)
                        data.MineReservation=result.MineReservation;
                   
                },
                complete: function (XMLHttpRequest, textStatus) {                   
                    data.loading = false;
                    self.$refs.scroller.finishPullToRefresh();
                }
            })
        },
       Append: function (done) {
           appendDone = done;
            var data = this.$data;
            if (data.loading) {
                if (appendDone)
                    appendDone();
                return;
            }
            var nomore = false;
            var self = this;
            if(data.ReservationMe.length||data.MineReservation.length)
                data.param.pageindex += 1;
            else
                data.param.pageindex=1;
            data.loading = true;
            client.Request({
                type: "get",
                data: data.param,
                url: client.Api.minereservation,
                success: function (result) {
                    if ($('.text_color').attr("value") == 0) {
                        if (result.ReservationMine.length == 0)
                            nomore = true;
                        for (var i = 0; i < result.ReservationMine.length; i++)
                            data.ReservationMe.push(result.ReservationMine[i]);
                    }
                    else {
                        if (result.MineReservation.length == 0)
                            nomore = true;
                        for (var i = 0; i < result.MineReservation.length; i++)
                            data.MineReservation.push(result.MineReservation[i]);
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (textStatus == 'error')
                        nomore = true;
                    data.loading = false;                 
                    self.$refs.scroller.finishInfinite();
                    appendDone(nomore);
                }
            })
        },
    }
})
$(function () {
    if (!client.IsLogin()) {
        location.href = '/passport/login?returnurl=%2Fexpert%2Fminereservation';
        return;
    }

    Vue.filter("time", function (val) {
        return val.substring(0, 10);
    })  
   $(".reservation li").on("click", function () {
        MR.$refs.scroller.triggerPullToRefresh();
        $(this).addClass("text_color").siblings().removeClass("text_color");
        $(".reservation_box").css("display", "none").eq($(this).index()).css("display", "block");       
    })
    $('._v-content').css("margin-top", "90px");
  
})