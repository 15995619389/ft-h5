import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import { Toast } from 'mint-ui'

var demand = new Vue({
    el: '.mui-content',
    data: {
        critique: {},
        demand: {},
        expert: {},
        ExpertName: {}
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
                url: client.Api.critique + '?id=' + $('#did').val(),
                success: function (result) {
                    data.critique = result.critique
                    data.demand = result.model
                    if (result.model.SolveModel != null) {
                        if (result.model.AuditingStatus == 9) {
                            window.history.go(-1)
                            return
                        }
                        data.expert = result.model.SolveModel
                        if (result.model.SolveModel.ExpertModel != null) { data.ExpertName = result.model.SolveModel.ExpertModel.ExpertName }
                    }
                    if (result.critique != null) {
                        var s = $('#Service').find('i')
                        var c = $('#Communicate').find('i')
                        var r = $('#Retroaction').find('i')
                        for (var i = 0; i < data.critique.Service; i++) {
                            s[i].className = 'org-star'
                        }
                        for (var i = 0; i < data.critique.Communicate; i++) {
                            c[i].className = 'org-star'
                        }
                        for (var i = 0; i < data.critique.Retroaction; i++) {
                            r[i].className = 'org-star'
                        }
                    }
                },
                complete: function (XMLHttpRequest, textStatus) { }
            })
        },
        submit: function () {
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
                Appraise: $('#Appraise').val(),
                TargerUserId: $('#TargerUserId').val()
            }
            client.Request({
                type: 'post',
                data: postData,
                url: client.Api.finishcritique,
                success: function (result) {
                    if (result.Flag) {
                        window.location.href = '/demand/cqsuccess'
                    } else {
                        Toast({ message: result.Message, duration: 1000 })
                    }
                }
            })
        }
    }
})

$(function () {
    $('#submit').on('click', demand.submit)
    $('.stcti-box li .stc-star').append('<span class="fen"></span>')
    $('.stc-star i').click(function () {
        var $fen = 0
        $(this).parent().find('i').removeClass('org-star').addClass('grey-star') // 清空分
        $(this).removeClass('grey-star').addClass('org-star').prevAll().addClass('org-star').removeClass('grey-star')
        $fen = $(this).index() + 1
        $(this).parents('.stcti-box li .stc-star').find('.fen').text($fen + '分')
    })
})
