import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl} from '../../modules/UrlService'
import * as storage from '../../modules/StorageService'
import {Popup,Toast} from 'mint-ui'
import preview from '../../components/img-preview.vue'
import share from '../../components/share/ShareV2.vue'
import rightsidebar from "../../components/RightSideBar.vue";

new Vue({
    el: '.vue-container',
    components: {
        'popup': Popup,
        preview,
        share,
        rightsidebar
    },
    data: {
        product: {},
        isConsultPanelVisiabel: false,
        consult: {
            BrandProductId: null,
            ConsultationType: null,
            UserRealName: null,
            Mobile: null,
            ConsultationContent: null
        },
        currentUser: null,
        showPopup: false,
        showInfoPopup: false
    },
    created: function () {
        this.Get()
    },
    mounted:function(){
        var self=this
        this.$refs.share.Init({
            title: document.title
        })
    },
    methods: {
        Get: function () {
            var self = this
            client.Request({
                url: '/unique/detail/' + GetIdFromUrl(),
                data: {},
                type: 'get',
                async: false,
                success: function (res) {
                    if (!res.ImgUrl) {
                        res.ImgUrl = '/Content/image/MilitaryCivilian/classify2.png'
                    }
                    self.$data.product = res
                    document.title = res.Title
                    $('#description')[0].content = res.Introduction
                    self.$data.consult.BrandProductId = GetIdFromUrl()
                }
            })
        },
        SharePage: function () {
            this.$refs.share.Show()
        },
        ShowPreview: function () {
            this.$refs.preview.Show(this.$data.product.ImgUrl)
        },
        Consult: function (type) {
            var self = this
            self.$data.currentUser = storage.Get('i_login')
            if (self.$data.currentUser) {
                client.Request({
                    type: 'get',
                    url: '/user/complete',
                    success: function (res) {
                        if (res.err_code == '401') {
                            self.$data.showPopup = true
                        } else if (res.data == 0) {
                            self.$data.showInfoPopup = true
                        } else {
                            $('.consult-panel').show()
                            self.$data.consult.ConsultationType = type
                            self.$data.consult.UserRealName = self.$data.currentUser.RealName
                            self.$data.consult.Mobile = self.$data.currentUser.CallPhone
                            self.$data.isConsultPanelVisiabel = true
                        }
                    }
                })
            } else {
                this.$data.showPopup = true
            }
        },
        Submit: function () {
            var self = this
            if (!self.$data.consult.ConsultationContent) {
                Toast({
                    message: '请填写咨询内容！',
                    duration: 1000
                })
                return
            }
            if (!self.$data.consult.Mobile) {
                Toast({
                    message: '请填写联系方式！',
                    duration: 1000
                })
                return
            }
            if (!/^\d{11}$/.test(self.$data.consult.Mobile)) {
                Toast({
                    message: '请输入正确的联系方式！',
                    duration: 1000
                })
                return
            }
            if (!self.$data.consult.UserRealName) {
                Toast({
                    message: '请填写真实姓名！',
                    duration: 1000
                })
                return
            }
            if (storage.Get('i_login')) {
                client.Request({
                    type: 'post',
                    url: '/unique/consult',
                    data: this.$data.consult,
                    success: function (res) {
                        self.$data.isConsultPanelVisiabel = false
                        self.$data.consult.ConsultationContent = ''
                        Toast({
                            message: '咨询已经提交，我们会在24小时内与您联系，请保持电话畅通，谢谢！',
                            duration: 1000
                        })
                    }
                })
            } else {
                Toast({
                    message: '请先登录！',
                    duration: 1000
                })
            }
        },
        Cancel: function () {
            this.$data.isConsultPanelVisiabel = false
            this.$data.consult.ConsultationContent = ''
        },
        GoLogin: function () {
            window.location.href = '/passport/login?returnurl=' + encodeURIComponent(window.location.href)
        },
        HidePopup: function () {
            this.$data.showPopup = false
            this.$data.showInfoPopup = false
        },
        GoCompleteInfo: function () {
            window.location.href = '/mybusiness/basicinformation'
        }
    },
    filters: {
        FormatDate: function (value) {
            if (value != null) {
                return value.substr(0, 10)
            }
        }
    }
})
