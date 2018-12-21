import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import * as StatusService from '../../modules/StatusService'
import { Toast } from 'mint-ui'
import { GetIdFromUrl } from '../../modules/UrlService'

new Vue({
    el: '.mui-content',
    data: {
        prize: [],
        PrizeStatus: StatusService.PrizeStatus
    },
    created: function () {
        this.islogin()
        this.Init()
    },
    methods: {
        islogin: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
            }
        },
        Init: function () {
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.Mprize + '?id=' + GetIdFromUrl(),
                success: function (result) {
                    data.prize = result
                },
                complete: function (XMLHttpRequest, textStatus) { }
            })
        },
        Sumb: function (id) {
            this.islogin()
            if ($('#Consignee').val() == '' || $('#Telephone').val() == '' || $('#Addressee').val() == '') {
                Toast({ message: '请将信息填写完整', duration: 1000 })
                return
            }
            var pData = {
                Id: id,
                Consignee: $('#Consignee').val(),
                Telephone: $('#Telephone').val(),
                Addressee: $('#Addressee').val()
            }
            client.Request({
                type: 'post',
                data: pData,
                url: client.Api.getprize,
                success: function (result) {
                    if (result.Flag) { window.location.href = '/act/getsuccess' } else { Toast({ message: result.Message, duration: 1000 }) }
                },
                complete: function (XMLHttpRequest, textStatus) { }
            })
        }
    }
})

// $(function () {
//    var MP = new MyPrize();
// });
// var MyPrize = Class.extend({
//    init: function () {
//        this.initVue();
//        this.initData();
//    },
//    initVue: function () {
//        this.vue = new Vue({
//            el: '.mui-content',
//            data: {
//                prize: [],
//                PrizeStatus: StatusService.PrizeStatus
//            },
//            methods: {
//                Sumb: $.proxy(this._sumb, this)
//            },
//        });
//    },
//    initData: function () {
//        islogin();
//        var data = this.vue.$data;
//        client.Request({
//            type: "post",
//            url: client.Api.Mprize + '?id=' + $('#id').val(),
//            success: function (result) {
//                data.prize = result;
//            }, complete: function (XMLHttpRequest, textStatus) {
//            }
//        });
//    },
//    _sumb: function (id) {
//        islogin();
//        if ($('#Consignee').val() == "" || $('#Telephone').val() == "" || $('#Addressee').val() == "") {
//            Toast({message:"请将信息填写完整",duration:1000});
//            return;
//        }
//        var pData = {
//            Id: id,
//            Consignee: $('#Consignee').val(),
//            Telephone: $('#Telephone').val(),
//            Addressee: $('#Addressee').val(),
//        };
//        client.Request({
//            type: "post",
//            data: pData,
//            url: client.Api.getprize,
//            success: function (result) {
//                if (result.Flag)
//                    location.href = '/act/getsuccess';
//                else
//                    Toast({message:result.Message,duration:1000});
//            }, complete: function (XMLHttpRequest, textStatus) {
//            }
//        });
//    }
// });
