import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { Toast, Indicator } from 'mint-ui'

$(function () {
    $('.head-address-li').on('click', function () {
        $('.area').animate({
            'width': '0%'
        }, 10)
        $('.provice').animate({
            'width': '100%'
        }, 300)
        $('.head-address-ul').find('li').eq(1).html('')
        $('.head-address-ul').find('li').eq(0).html('请选择')
    })

    $('#addressBack').on('click', function () {
        $('.address-box').css({ 'display': 'none' })
        $('.applySupplier').css({ 'display': 'block' })
    })
})

function proviceinit() {
    $('.provice li').click(function () {
        var otext = $(this).html()
        $(this).addClass('checked-color').siblings().removeClass('checked-color')
        $('.provice').animate({
            'width': '0%'
        }, 200)
        $('.area').animate({
            'width': '100%'
        }, 200)
        var proviceId = $(this).attr('codeId')
        loadCity(proviceId)
        $('.head-address-ul').find('li').eq(1).html('请选择')
        $('.head-address-ul').find('li').eq(0).html(otext)
        if (vm.$data.PerType == 1) {
            $('#nowValue').html(otext)
            vm.$data.Personal.ExpertProvince = proviceId
        } else {
            $('#nowValue1').html(otext)
            vm.$data.Enterprise.ExpertProvince = proviceId
        }
    })
}

function areainit() {
    $('.area li').click(function () {
        $(this).addClass('checked-color').siblings().removeClass('checked-color')
        var oValue = $(this).html()
        var cityId = $(this).attr('codeId')
        var provice = $('.head-address-ul').find('li').eq(0).html()
        if (vm.$data.PerType == 1) {
            $('#nowValue').html(provice + ' ' + oValue)
            vm.$data.Personal.ExpertCity = cityId
        } else {
            $('#nowValue1').html(provice + ' ' + oValue)
            vm.$data.Enterprise.ExpertCity = cityId
        }
        $('.address-box').css({ 'display': 'none' })
        $('.applySupplier').css({ 'display': 'block' })
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

function loadprovice() {
    $('.applySupplier').css({
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

var vm = new Vue({
    el: '.applySupplier',
    data: {
        DetyName: '',
        PerType: 1,
        Personal: { ExpertDutyName: '', ExpertsServiceIds: [] },
        Enterprise: { ExpertDeptCertificateType: '', ExpertDutyName: '', ExpertsServiceIds: [] },
        ExpertsService: [
            { 'name': '产品研发服务', 'value': '1' },
            { 'name': '工艺改进服务', 'value': '6' },
            { 'name': '设备改进服务', 'value': '2' },
            { 'name': '产品生产、代加工服务', 'value': '11' },
            { 'name': '检测服务', 'value': '7' },
            { 'name': '成熟的产品、解决方案', 'value': '12' },
            { 'name': '认证服务', 'value': '3' },
            { 'name': '项目申报服务', 'value': '8' },
            { 'name': '培训服务', 'value': '9' },
            { 'name': '技术咨询服务', 'value': '13' },
            { 'name': '租赁服务', 'value': '5' },
            { 'name': '知识产权及成果转化服务', 'value': '14' },
            { 'name': '投融资服务', 'value': '4' },
            { 'name': '设计服务', 'value': '10' },
            { 'name': '其他', 'value': '15' }
        ],
        isSubmit: true
    },
    created: function () {
        this.Init()
    },
    methods: {
        Init: function () {
            if (!client.GetCurrentUser()) {
                window.location.href = client.LoginReturn(window.location.href)
                return
            }
            Indicator.open('加载中...')
            client.Request({
                type: 'get',
                url: '/expert/getexpertstate',
                success: function (result) {
                    if (result.StausCode != '200') {
                        $('.successful').children('p').html(result.Message)
                        if (result.StausCode == '201') {
                            $('#sucess201').css({ 'display': 'block' })
                        } else if (result.StausCode == '202') {
                            var splitMsg = result.Message.split(',')
                            $('.successful').children('p').html(splitMsg[0])
                            $('#sucess202').html(splitMsg[1])
                            $('#sucess202').css({ 'display': 'block' })
                        } else if (result.StausCode == '203') {
                            $('.successful').children('img').attr('src', '/Content/image/error.png')
                            $('#sucess203').css({ 'display': 'block' })
                            $('#backUpdate').attr('href', $('#backUpdate').attr('href'))
                        } else {
                            $('.successful').children('img').attr('src', '/Content/image/error.png')
                            $('#sucess204').css({ 'display': 'block' })
                        }
                        $('.applySupplier').css({ 'display': 'none' })
                        $('.submittedSuccessfuly').css({ 'display': 'block' })
                    } else {
                        $('.applySupplier').css({ 'display': 'block' })
                    }
                },
                complete: function () {
                    Indicator.close()
                }
            })
        },
        applicationProvider: function (model) {
            var self = this
            Indicator.open('提交中,请稍等...')
            client.Request({
                type: 'post',
                url: '/expert/v2/applicationprovider',
                data: model,
                success: function (result) {
                    if (result.StausCode == '209') {
                        Toast({ message: result.Message, duration: 1000 })
                        return
                    }
                    $('.successful').children('p').html(result.Message)
                    if (result.StausCode != '200') {
                        if (result.StausCode == '201') {
                            $('#sucess201').css({ 'display': 'block' })
                        } else if (result.StausCode == '202') {
                            var splitMsg = result.Message.split(',')
                            $('.successful').children('p').html(splitMsg[0])
                            $('#sucess202').html(splitMsg[1])
                            $('#sucess202').css({ 'display': 'block' })
                        }
                        else if(result.StausCode == '204') {
                            $('.successful').children('img').attr('src', '/Content/image/error.png')
                            $('#sucess204').css({ 'display': 'block' })
                        }
                        else {
                            $('.successful').children('img').attr('src', '/Content/image/error.png')
                            $('#sucess203').css({ 'display': 'block' })
                        }
                    }

                    $('#successBack').attr('href', '/')
                    $('.applySupplier').css({ 'display': 'none' })
                    $('.submittedSuccessfuly').css({ 'display': 'block' })
                },
                complete: function () {
                    self.$data.isSubmit = true
                    Indicator.close()
                }
            })
        },
        workAddressClick: function () {
            loadprovice()
        },
        applyPost: function () {
            var self = this
            if (!client.GetCurrentUser()) {
                Toast({ message: '登录失效', duration: 1000 })
                setTimeout(function () {
                    window.location.href = client.LoginReturn(window.location.href)
                }, 1000)
                return
            }

            if (self.validate() && self.$data.isSubmit) {
                var data = {}
                $.extend(data, self.$data.PerType == 1 ? self.$data.Personal : self.$data.Enterprise)
                data.PerOrDeptType = self.$data.PerType
                data.ExpertsServiceIds = data.ExpertsServiceIds.join(',')
                self.applicationProvider(data)
            }
        },
        validate: function () {
            var model = this.$data.PerType == 1 ? this.$data.Personal : this.$data.Enterprise
            if (this.$data.PerType == 2) {
                if (!model.ResponsibleName) { Toast({ message: '姓名不能为空', duration: 1000 }); return false }
                if (model.ResponsibleName.length > 50) { Toast({ message: '姓名不能大于50个字', duration: 1000 }); return false }
            }
            if (!model.ExpertDuty && !model.ExpertDutyName) { Toast({ message: '职务或职称必填一项', duration: 1000 }); return false }
            if (model.ExpertDuty && model.ExpertDuty.length > 50) { Toast({ message: '职务不能大于50个字', duration: 1000 }); return false }
            if (!model.ExpertProvince || !model.ExpertCity) { Toast({ message: '工作地址不能为空', duration: 1000 }); return false }
            if (!model.ExpertsServiceIds || !model.ExpertsServiceIds.length) { Toast({ message: '至少选择一个可提供的服务', duration: 1000 }); return false }
            if (model.ExpertSRemark && model.ExpertSRemark.length > 100) { Toast({ message: '其他服务不能大于100个字', duration: 1000 }); return false }
            if (this.$data.PerType == 2) {
                if (model.ExpertDeptCertificateNum && model.ExpertDeptCertificateNum.length > 50) { Toast({ message: '单位证件号码不能大于50个字', duration: 1000 }); return false }
                if (model.ExpertDeptCertificateAddress && model.ExpertDeptCertificateAddress.length > 50) { Toast({ message: '单位注册地址不能大于50个字', duration: 1000 }); return false }
                if (model.ExpertDeptAddress && model.ExpertDeptAddress.length > 50) { Toast({ message: '单位通讯地址不能大于50个字', duration: 1000 }); return false }
            }
            if (!model.ScientificContent) { Toast({ message: '擅长领域不能为空', duration: 1000 }); return false }
            if (model.ScientificContent.length > 5000) { Toast({ message: '擅长领域不能大于5000个字', duration: 1000 }); return false }
            if (model.PersonExplain && model.PersonExplain.length > 5000) { Toast({ message: '简介不能大于5000个字', duration: 1000 }); return false }
            if (model.ExpertRemark && model.ExpertRemark.length > 5000) { Toast({ message: '备注不能大于5000个字', duration: 1000 }); return false }

            return true
        },
        TypeSelect: function (status) {
            this.$data.PerType = status
            this.$data.Personal.ExpertDutyName = ''
            this.$data.Enterprise.ExpertDutyName = ''
            this.$data.DetyName = ''
        },
        DutyNameSelect: function (dutyName) {
            if (this.$data.PerType == 1) {
                this.$data.Personal.ExpertDutyName = dutyName
            } else {
                this.$data.Enterprise.ExpertDutyName = dutyName
            }
            this.$data.DetyName = dutyName
            mui('.mui-popover').popover('hide')
        }
    }
})
