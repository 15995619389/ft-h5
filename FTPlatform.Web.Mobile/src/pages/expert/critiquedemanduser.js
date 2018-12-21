import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import { Toast } from 'mint-ui'

new Vue({
    el: '.mui-content',
    data: {
        demand: {},
        demandname: {}
    },
    created: function () {
        this.initData()
    },
    methods: {
        initData: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.critiqueDU + '?id=' + $('#did').val(),
                success: function (result) {
                    if (result.Status == 9) {
                        window.history.go(-1)
                        return
                    }
                    data.demand = result.DemandModel
                    data.demandname = result.DemandModel.UserModel.RealName
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            })
        }
    }
})
$(function () {
    $('#submit').on('click', submit)
    $('.stcti-box li .stc-star').append('<span class="fen"></span>')
    $('.stc-star i').click(function () {
        var $fen = 0
        $(this).parent().find('i').removeClass('org-star').addClass('grey-star')// 清空分
        $(this).removeClass('grey-star').addClass('org-star').prevAll().addClass('org-star').removeClass('grey-star')
        $fen = $(this).index() + 1
        $(this).parents('.stcti-box li .stc-star').find('.fen').text($fen + '分')
    })
})
function submit() {
    var Service = 0
    var Communicate = 0
    var Retroaction = 0
    $('.stcti-box').find('.fen').each(function (index) {
        if (index == 0) {
            Service = $(this).text().substring(0, 1)
        }
        if (index == 1) {
            Communicate = $(this).text().substring(0, 1)
        }
        if (index == 2) {
            Retroaction = $(this).text().substring(0, 1)
        }
    })
    if (Service == 0) {
        Toast({ message: '请选择服务态度.', duration: 1000 })
        return
    }
    if (Communicate == 0) {
        Toast({ message: '请选择沟通顺畅度.', duration: 1000 })
        return
    }
    if (Retroaction == 0) {
        Toast({ message: '请选择反馈速度.', duration: 1000 })
        return
    }
    if ($('#Appraise').val() == '') {
        Toast({ message: '请输入评价内容.', duration: 1000 })
        return
    }

    var postData = {
        DemandId: $('#did').val(),
        Service: Service,
        Communicate: Communicate,
        Retroaction: Retroaction,
        Appraise: $('#Appraise').val()
        // ReviewLevel: page.DemandCritique.ReviewLevel,
        // TargerUserId: $("#TargerUserId").val()
    }
    client.Request({
        type: 'post',
        data: postData,
        url: client.Api.finishcritiqueDU,
        success: function (result) {
            if (result.Flag) { window.location.href = '/demand/cqsuccess' } else { Toast({ message: result.Message, duration: 1000 }) }
        }
    })
}
