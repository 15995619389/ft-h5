import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { Popup, Toast } from 'mint-ui'
import preview from '../../components/img-preview.vue'
import rightsidebar from '../../components/RightSideBar.vue'

Vue.filter('formatMobile', function (value) {
    if (value != null) {
        var myphone = value.substr(3, 4)
        var lphone = value.replace(myphone, '****')
        return lphone
    }
})

Vue.filter('formatName', function (value) {
    if (value != null) {
        var fName = ''
        if (value.length == 2) {
            fName = value.replace(value.substr(1), '*')
        }
        if (value.length >= 3) {
            fName = value.replace(value.substr(1, 2), '**')
        }
        return fName
    }
})

Vue.filter('formatDateLong', function (value) {
    if (value != null && value != '') {
        return value.replace('T', ' ').substring(0, 19)
    }
})

new Vue({
    el: '#container',
    components: {
        popup: Popup,
        preview,
        rightsidebar
    },
    data: {
        expertUserId: null, // 专家用户ID
        detailModel: {}, // 详细信息
        critiquelist: {}, // 评价列表
        patentlist: {}, // 专利信息
        // Preview: false,
        // Image: null,
        PopupMessage: '',
        PopupUrl: '',
        IsPopupVisiable: false
    },
    created: function () {
        if (!this.GetGuidIdFromUrl()) {
            window.location.href = '/expert'
            return
        }
        this.Init()
    },
    methods: {
        Init: function () {
            var _self = this
            var _data = this.$data
            client.Request({
                type: 'get',
                url: '/expert/expertInfobyId?expertId=' + _self.GetGuidIdFromUrl(),
                async: false,
                success: function (result) {
                    if (result.StausCode == '200') {
                        _data.expertUserId = result.DataSource.UserID
                        _data.detailModel = result.DataSource
                        _data.critiquelist = result.DataSource.Critiquelist.Entitys
                        _data.patentlist = result.DataSource.FTPatentList
                    }
                }
            })
        },
        appoint: function () {
            var self = this
            if (!client.GetCurrentUser()) {
                self.PopupLogin()
                return
            }
            var _data = this.$data
            client.Request({
                type: 'get',
                url: '/expert/appointexpert',
                data: { expertid: _data.expertUserId },
                success: function (result) {
                    if (result.StausCode == '201') {
                        self.PopupBaseInfo()
                        return
                    }
                    if (result.StausCode == '200' || result.StausCode == '204') {
                        _data.detailModel.isAppointment = true
                    }
                    Toast({ message: result.Message, duration: 1000 })
                }
            })
        },
        exchange: function () {
            var self = this
            if (!client.GetCurrentUser()) {
                self.PopupLogin()
                return
            }
            var _data = this.$data
            client.Request({
                type: 'get',
                url: '/expert/carteexchange',
                data: { expertid: _data.expertUserId },
                success: function (result) {
                    if (result.StausCode == '205') {
                        self.PopupBaseInfo()
                        return
                    }
                    if (result.StausCode == '200') {
                        _data.detailModel.isExchangeCard = 0
                    } else if (result.StausCode == '204') {
                        _data.detailModel.isExchangeCard = 1
                    }
                    Toast({ message: result.Message, duration: 1000 })
                }
            })
        },
        attention: function () {
            var self = this
            if (!client.GetCurrentUser()) {
                self.PopupLogin()
                return
            }
            var _data = this.$data
            client.Request({
                type: 'get',
                url: '/expert/attentionexpert',
                data: { expertid: _data.expertUserId },
                success: function (result) {
                    if (result.StausCode == '200') {
                        _data.detailModel.IsFollowed = true
                    } else if (result.StausCode == '203') {
                        _data.detailModel.IsFollowed = false
                    }
                    Toast({ message: result.Message, duration: 1000 })
                }
            })
        },
        PopupRedirect: function () {
            window.location.href = this.$data.PopupUrl
        },
        HidePopup: function () {
            this.$data.IsPopupVisiable = false
        },
        PopupLogin: function () {
            this.$data.PopupMessage = '登录后继续，是否登录？'
            this.$data.PopupUrl =
                '/passport/login?returnurl=' +
                encodeURIComponent(window.location.href)
            this.$data.IsPopupVisiable = true
        },
        PopupBaseInfo: function () {
            this.$data.PopupMessage = '请先完善个人信息,是否现在完善？'
            this.$data.PopupUrl =
                '/mybusiness/basicinformation?returnurl=' +
                encodeURIComponent(window.location.href)
            this.$data.IsPopupVisiable = true
        },
        ShowPreview: function () {
            this.$refs.preview.Show(this.$data.detailModel.User.AvatarUrl)
        },
        GetGuidIdFromUrl: function () {
            var url = location.href
            var index = url.indexOf('?')
            if (index != -1) {
                url = url.substring(0, index)
            }
            var arr = url.split('/')
            var id = arr[arr.length - 1]
            return id
        }
    },
    filters: client.Filters
})
