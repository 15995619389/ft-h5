﻿import * as client from '../../modules/ApiClient'
import Vue from 'vue'
import {Toast} from 'mint-ui'

new Vue({
    el: '.mui-content',
    data: {
        agent: {},
        agentimg: {},
        pc: '',
        code: ''
    },
    created: function () {
        this.initData()
    },
    methods: {
        workAddressClick: function () {
            loadprovice()
        },
        initData: function () {
            var data = this.$data
            client.Request({
                type: 'post',
                url: client.Api.agentdetail,
                success: function (result) {
                    data.agent = result.agent
                    data.pc = result.province + ',' + result.city
                    data.agentimg = result.agentimg
                    if (data.agentimg != null) {
                        if (data.agentimg.CertificateNo != null) { $('#CertificateNo').val(data.agentimg.CertificateNo) }
                        if (data.agentimg.AgentCertificate != null) { $('#AgentCertificate').attr('src', data.agentimg.AgentCertificate) }
                    }
                    data.code = result.agent.Province + ',' + result.agent.City
                },
                complete: function (XMLHttpRequest, textStatus) {
                }
            })
        },
        submit: function () {
            if (!client.IsLogin()) {
                window.location.href = '/passport/login?returnurl=' + window.location.href
                return
            }
            var $ExpertAddress = $('#address').val().split(',')
            var $ExpertProvince = $ExpertAddress[0]
            var $ExpertCity = $ExpertAddress[1]
            var postData = {
                Id: $('#id').val(),
                Address: $('#Address').val(),
                Province: $ExpertProvince,
                City: $ExpertCity,
                IsSupplier: $('input:radio:checked[name=radio2]').val() != 0,
                Positional: $('#Positional').val(),
                Position: $('#Position').val(),
                CertificateNo: $('#CertificateNo').val(),
                PerProfile: $('#PerProfile').val(),
                AgentCertificate: $('#AgentCertificate').attr('src') == '/Content/image/camera.png' ? null : $('#AgentCertificate').attr('src'),
                TechnicalAbility: $('#TechnicalAbility').val()
            }
            if ($('#demo1').val() == '') {
                Toast({message: '请选择省市', duration: 1500})
                return
            }
            if ($('#Positional').val() == '' && $('#Position').val() == '') {
                Toast({message: '请输入职称或职务', duration: 1500})
                return
            }
            if ($('#Position').val().length > 10) {
                Toast({message: '职务最多输入10个字', duration: 1500})
                return
            }
            if ($('#TechnicalAbility').val() == '') {
                Toast({message: '请输入技术能力简介', duration: 1500})
                return
            }
            var r = window.location.href
            var s = r.indexOf('?')
            r = r.substring(s + 1, r.length)
            client.Request({
                type: 'post',
                url: client.Api.agentedit,
                data: postData,
                success: function (result) {
                    if (result.Flag) {
                        window.location.href = '/agent/submited' + '?' + r
                    } else { Toast({message: result.Message, duration: 1500}) }
                }
            })
        }
    }

})
window.onload = function () {
    $('#fileField').on('change', function () {
        if (!client.IsLogin()) {
            window.location.href = '/passport/login?returnurl=' + window.location.href
            return
        }
        layer.open({
            type: 1,
            title: '上传证书',
            area: ['100%', '100%'],
            btn: ['提交', '取消'],
            content: $('#crop-avatar'), // 捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            yes: function (index, layero) {
                var t = $('.conmit').click()
                if (t) { layer.close(index) }
            },
            btn2: function () {
                $('.cancel').click()
            },
            end: function () {
                $('.cancel').click()
            }
        })
    })
}
// 加载省市
function loadprovice() {
    $('.writemessage').css({
        'display': 'none'
    })
    $('.address-box').css({
        'display': 'block'
    })
    client.Request({
        type: 'get',
        url: '/expert/getprovinceorcity',
        async: false,
        data: { type: 1 },
        success: function (result) {
            if (result.StausCode == '200') {
                var liHtml = ''
                $.each(result.DataSource, function (i, item) {
                    liHtml += '<li codeId=' + item.CodeId + '>' + item.Name + '</li>'
                })
                $('.provice').html(liHtml)
            }
        },
        complete: function () {
            proviceinit()
        }
    })
}
function proviceinit() {
    $('.provice li').click(function () {
        var otext = $(this).html()
        $(this).addClass('checked-color').siblings().removeClass('checked-color')
        $('.provice').animate({
            'width': '0%'
        }, 10)
        $('.area').animate({
            'width': '100%'
        }, 100)
        var proviceId = $(this).attr('codeId')
        loadCity(proviceId)
        $('.head-address-ul').find('li').eq(1).html('请选择')
        $('.head-address-ul').find('li').eq(0).html(otext)
        $('#parentid').val(proviceId)
    })
}
function loadCity(parentId) {
    client.Request({
        type: 'get',
        url: '/expert/getprovinceorcity',
        async: false,
        data: { type: 2, parentid: parentId },
        success: function (result) {
            if (result.StausCode == '200') {
                var liHtml = ''
                $.each(result.DataSource, function (i, item) {
                    liHtml += '<li codeId=' + item.CodeId + '>' + item.Name + '</li>'
                })
                $('.area').html(liHtml)
            }
        },
        complete: function () {
            areainit()
        }
    })
}
function areainit() {
    $('.area li').click(function () {
        $(this).addClass('checked-color').siblings().removeClass('checked-color')
        var oValue = $(this).html()
        // var oValue = $(".head-address-li").html() + $(this).html();
        var cityId = $(this).attr('codeId')
        var provice = $('.head-address-ul').find('li').eq(0).html()
        $('#demo1').val(provice + ',' + oValue)
        $('#address').val($('#parentid').val() + ',' + cityId)
        $('.address-box').css({
            'display': 'none'
        })
        $('.writemessage').css({
            'display': 'block'
        })
    })
}
$('#addressBack').on('click', function () {
    $('.address-box').css({
        'display': 'none'
    })
    $('.writemessage').css({
        'display': 'block'
    })
})
$('.head-address-li').click(function () {
    $('.provice').animate({
        'width': '100%'
    }, 10)
    $('.area').animate({
        'width': '0%'
    }, 100)
})
// …………
$(function () {
    if (!client.IsLogin()) {
        window.location.href = '/passport/login?returnurl=' + window.location.href
    }
})
