import * as client from "../../modules/ApiClient";
import Vue from "vue";
import {Toast} from "mint-ui";
import {Indicator} from "mint-ui";

var MyCarte = new Vue({
            el: '.mui-content',
            data: {
                carte: [],
                Preview:false,
            },
            created:function(){
                this.initData();
            },
            methods: {
                ShowPreview: function () {
                    this.$data.Preview = true;
                },
                ClosePreview: function () {
                    this.$data.Preview = false;
                },
                initData: function () {
                    var data = this.$data;
                    Indicator.open({text: '加载中',});
                   client.Request({
                        type: "post",
                        url: client.Api.mycarte + '?id=' + $('#id').val(),
                        success: function (result) {
                            data.carte = result;
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            Indicator.close();
                        }
                    })
                },
            }
        })
$(function () {
    var user = client.GetCurrentUser();
    if (user == null || user.Id != $('#id').val()) {
        $('#update').css("display", "none");
        $("h1").html("名片详情");
    }
    $(".toglle i").click(function () {
        if ($(".business_box").css("display") == 'block')
            $(this).css("-webkit-transform", "rotate(-180deg)");
        else
            $(this).css("-webkit-transform", "");
        $(".business_box").toggle(300)

    })

})