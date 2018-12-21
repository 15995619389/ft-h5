import Vue from 'vue'
import * as api from '../../modules/ApiClient'
import {
    Indicator
} from 'mint-ui'

new Vue({
    el: '#container',
    data: {
        form: {
            Mobile: '',
            Code: '',
            IamgeVerCode: '',
            Password: '',
            ConfirmPwd: '',
            UserType: '1',
            Referee: '',
            IsAgreeProtocol: true,
            afs_scene: '',
            afs_token: '',
            csessionid: '',
            sig: '',
            token: '',
            scene: ''
        },
        IsProcessing: false,
        Sec: 60,
        IsSubmit: false,
        ErrorMsg: '',
        IsErrorVisible: false,
        SendBtnText: '获取验证码'
    },
    created: function () {
        var self = this
        this.$data.form.Referee=$("#RefCode").val();

        // 事件绑定
        $(document).on('click', '#SendValCode', self.SendCode)
        $(document).on('click', '#Register', self.Register)
        $(document).on('blur', '#Mobile', self.Validate)
        $(document).on('blur', '#Code', self.Validate)
        $(document).on('blur', '#Password', self.Validate)
        $(document).on('blur', '#ConfirmPwd', self.Validate)
    },
    methods: {
        GetSession: function () {
            this.form.afs_scene = $('#afs_scene').val()
            this.form.afs_token = $('#afs_token').val()
            this.form.csessionid = $('#csessionid').val()
            this.form.sig = $('#sig').val()
            this.form.token = $('#token').val()
            this.form.scene = $('#scene').val()
        },
        ValidateMobile: function () {
            if (this.form.Mobile == '') {
                this.ErrorMsg = '请输入手机号码'
                this.IsErrorVisible = true
                return false
            }
            if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.form.Mobile))) {
                this.ErrorMsg = '手机号码有误，请重新输入'
                this.IsErrorVisible = true
                return false
            }
            this.IsErrorVisible = false
            return true
        },
        Validate: function () {
            if (!this.ValidateMobile()) {
                return false
            }
            if (this.form.Code == '') {
                this.ErrorMsg = '请填写验证码'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.csessionid == '') {
                this.ErrorMsg = '请先通过滑动验证'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.Password == '') {
                this.ErrorMsg = '请填写密码'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.Password.length < 6) {
                this.ErrorMsg = '密码至少6位'
                this.IsErrorVisible = true
                return false
            }
            if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.form.Password))) {
                this.ErrorMsg = '密码由英文字母和数字组成，至少6位'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.ConfirmPwd == '') {
                this.ErrorMsg = '请填写确认密码'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.ConfirmPwd != this.form.Password) {
                this.ErrorMsg = '两次输入的密码不一致'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.RegisterType <= 0) {
                this.ErrorMsg = '请选择注册类型'
                this.IsErrorVisible = true
                return false
            }
            if (this.form.IsAgreeProtocol != true) {
                this.ErrorMsg = '请同意注册协议'
                this.IsErrorVisible = true
                return false
            }
            this.IsErrorVisible = false
            return true
        },
        CountDown: function () {
            var self = this
            $('#SendValCode').text('60s可重新发送')
            var timeInterval = window.setInterval(function () {
                if (self.Sec <= 0) {
                    window.clearInterval(timeInterval)
                    self.Sec = 60
                    $('#SendValCode').text('获取验证码')
                    self.IsProcessing = false
                } else {
                    self.Sec -= 1
                    $('#SendValCode').text('' + self.Sec + 's可重新发送')
                }
            }, 1000)
        },
        RefurbishValidate: function () {
            document.getElementById('csessionid').value = ''
            document.getElementById('sig').value = ''
            document.getElementById('token').value = ''
            document.getElementById('scene').value = ''
            NoCaptcha.reset()
        },
        SendCode: function () {
            var self = this
            self.GetSession()
            if (self.IsProcessing) {
                return
            }
            if (!self.ValidateMobile()) {
                return
            }
            if (self.form.csessionid == '') {
                this.ErrorMsg = '请先通过滑动验证'
                this.IsErrorVisible = true
                return
            }
            this.IsProcessing = true
            Indicator.open('正在获取验证码...')
            self.CountDown()
            api.Request({
                type: 'post',
                url: '/passport/sendmobilecode',
                data: self.form,
                success: function (res) {
                    if (res && res.Flag) {
                        self.ErrorMsg = '验证码已发送'
                        self.IsErrorVisible = true
                        return
                    }
                    self.RefurbishValidate()
                    self.ErrorMsg = res.Message
                    self.IsErrorVisible = true
                    self.IsProcessing = false
                    self.Sec = 0
                },
                error: function (err) {
                    self.ErrorMsg = err.Message
                    self.IsErrorVisible = true
                    self.RefurbishValidate()
                },
                complete: function () {
                    Indicator.close()
                }
            })
        },
        Register: function () {
            var self = this
            self.GetSession()
            if (!self.Validate()) {
                return
            }
            Indicator.open('正在注册中，请稍等...')
            api.Request({
                type: 'post',
                url: '/passport/register',
                data: self.form,
                success: function (res) {
                    if (res && res.Flag) {
                        api.Storage.Set('i_login', res.DataSource)
                        setTimeout(function () {
                            var returnUrl = api.Storage.Get('returnurl')
                            if (!returnUrl || returnUrl.indexOf('register') >= 0) {
                                window.location.href = '/mybusiness/'
                                return
                            }
                            window.location.href = decodeURIComponent(returnUrl)
                        }, 300)
                        return
                    }
                    self.ErrorMsg = res.Message
                    self.IsErrorVisible = true
                },
                error: function (err) {
                    self.ErrorMsg = err.Message
                    self.IsErrorVisible = true
                    self.RefurbishValidate()
                },
                complete: function () {
                    Indicator.close()
                }
            })
        }
    }
})

var nc_appkey = 'FFFF0000000001687A53'
var nc_scene = 'register_h5'
var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':')
var nc_option = {
    renderTo: '#dom_id',
    appkey: nc_appkey,
    scene: nc_scene,
    token: nc_token,
    trans: '{"name1":"FFFF0000000001687A53"}', // 测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
    callback: function (data) {
        document.getElementById('csessionid').value = data.csessionid
        document.getElementById('sig').value = data.sig
        document.getElementById('token').value = nc_token
        document.getElementById('scene').value = nc_scene
    },
    error: function (s) {
    },
    verifycallback: function (data) {
    }
}
NoCaptcha.init(nc_option)
NoCaptcha.setEnabled(true)

/* -----用户协议------ */
$(function () {
    $('.ft-protocol').click(function () {
        $('.UserAgreement').addClass('show')
        $('.register-box').addClass('hide')
    })
    $('.UserAgreement').click(function () {
        $('.register-box').removeClass('hide')
        $(this).removeClass('show')
    })
})
