import * as client from "../../modules/ApiClient";
import Vue from "vue";
import { Toast } from 'mint-ui';

var code = $("#code").val();
var vm = new Vue({
    el: ".mui-content",
    data: {
        odfrom: [],
    },
    filters: {
        zt: function (value) {
            var typeVal = "待付款";
            switch (value) {
                case 1:
                    typeVal = "已付款";
                    break;
                case 2:
                    typeVal = "已申请换货";
                    break;
                case 3:
                    typeVal = "已申请退货";
                    break;
                case 4:
                    typeVal = "换货成功";
                    break;
                case 5:
                    typeVal = "退货成功";
                    break;
                case 6:
                    typeVal = "换货失败";
                    break;
                case 7:
                    typeVal = "退货失败";
                    break;
                case 8:
                    typeVal = "订单完成";
                    break;
                case 9:
                    typeVal = "无效订单";
                    break;
                default:
            }
            return typeVal;
        },
        lx: function (value) {
            var lxvalue = "状态有误";
            switch (value) {
                case 2:
                case 4:
                case 6:
                    lxvalue = "换货";
                    break;
                case 3:
                case 5:
                case 7:
                    lxvalue = "退货";
                    break;
                default:
            }
            return lxvalue;
        }
    },
    methods: {
        Reresh: function () {
            var _data = this;
            let instance  = Toast({ message: '正在加载...', position: 'middle', duration: -1 });
            client.Request({
                type: "post",
                url: client.Api.subtmentdetail + "?orderCode=" + code,
                success: function (result) {
                    _data.odfrom = result;
                    instance.close()
                },
                complete: function () {
                }
            })
        },
    },
    created: function () {
        this.Reresh();
    }
});