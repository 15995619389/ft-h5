<template>
    <div id="ft-quick-publish">
        <div id="quick-pull" v-on:click="Show">
            <span class="tab-icon icon-publish" style="top:-0.6rem;"></span>
            <span class="mui-tab-label" style="margin-top: -0.7rem;">快速发布</span>
        </div>
        <div id="component-quickpublish" v-bind:class="{show:IsActive}">
            <div class="shadow"></div>
            <div class="panel">
                <ul>
                    <li v-on:click="PublishDemand">
                        <a>
                            <span class="icon">
                                <i class="pic demand"></i>
                            </span>
                            <span class="text">发布需求</span>
                        </a>
                    </li>
                    <li v-on:click="PublishPetent">
                        <a>
                            <span class="icon">
                                <i class="pic patent"></i>
                            </span>
                            <span class="text">发布专利</span>
                        </a>
                    </li>
                    <li v-on:click="PublishTech">
                        <a>
                            <span class="icon">
                                <i class="pic tech"></i>
                            </span>
                            <span class="text">发布技术</span>
                        </a>
                    </li>
                    <li v-on:click="PublishProduct">
                        <a>
                            <span class="icon">
                                <i class="pic highPublish"></i>
                            </span>
                            <span class="text">发布产品</span>
                        </a>
                    </li>
                </ul>
                <div class="close">
                    <i v-on:click="Close"></i>
                </div>
            </div>
        </div>
        <qppopup v-model="IsPopupVisiable" position="bottom" style="width:100%;height:2.00rem;text-align:center;padding:0.40rem 0px">
            <div>
                <p style="margin-bottom:0.20rem" v-html="PopupMessage"></p>
                <div>
                    <button v-on:click="HidePopup">取消</button>
                    <button v-on:click="PopupRedirect">确定</button>
                </div>
            </div>
        </qppopup>
    </div>
</template>

<script>
import * as StorageService from '../../modules/StorageService'
import * as client from '../../modules/ApiClient'
import { Popup } from 'mint-ui'

export default {
    name: 'QuickPublish',
        components: {
        qppopup: Popup
        },
    data: function () {
        return {
            IsActive: false,
            Callback: null,
            IsPopupVisiable: false,
            PopupMessage: '',
            PopupUrl: ''
        }
    },
    methods: {
            Show: function () {
                this.IsActive = true
                if (this.$data.Callback) {
                    this.$data.Callback()
                }

                $('.mui-bar-tab').css({ 'z-index': '100' })

                setTimeout(function () {
                    $('html body').addClass('Ovhidden')
                    $('body').on('touchmove', function (e) {
                        e.preventDefault()
                    })
                }, 100)
            },
            Close: function () {
                this.IsActive = false

                $('.mui-bar-tab').css({ 'z-index': '10' })
                setTimeout(function () {
                    $('html body').removeClass('Ovhidden')
                    $('body').off('touchmove')
                }, 100)
            },
            HidePopup: function () {
                this.$data.IsPopupVisiable = false
            },
            ShowPopup: function () {
                this.$data.IsPopupVisiable = true
            },
            PopupRedirect: function () {
                window.location.href = this.$data.PopupUrl
            },
            IsLogin: function () {
                if (StorageService.Get('i_login')) {
                    return true
                }
                return false
            },
            Init: function (callback) {
                this.$data.Callback = callback
            },
            NeedLogin: function (type) {
                this.$data.PopupMessage = '登录后继续，是否登录？'
                var returnurl = ''
                switch (type) {
                    case 1:
                        returnurl = encodeURIComponent('/demand/publish')
                        break
                    case 3:
                        returnurl = encodeURIComponent('/techshare/publish')
                        break
                }
                this.$data.PopupUrl = '/passport/login?returnurl=' + returnurl
                this.ShowPopup()
            },
            NeedCompleteInfo: function (type) {
                this.$data.PopupMessage = '请先完善个人信息，是否现在完善？'
                var returnurl = ''
                switch (type) {
                    case 1:
                        returnurl = encodeURIComponent('/demand/publish')
                        break
                    case 2:
                        returnurl = encodeURIComponent('/patent/publish')
                        break
                    case 3:
                        returnurl = encodeURIComponent('/techshare/publish')
                        break
                }

                this.$data.PopupUrl = '/mybusiness/basicinformation?returnurl=' + returnurl
                this.ShowPopup()
            },
            NeedMerchant:function(){
                this.$data.PopupMessage = '您还不是商家，是否现在申请入驻？'
                this.$data.PopupUrl ='/seller/settled'
                this.ShowPopup()
            },
            PublishDemand: function () {
                var self = this
                if (this.IsLogin()) {
                    client.Request({
                        type: 'get',
                        url: '/user/complete',
                        success: function (res) {
                            if (res.err_code == '401') {
                                self.NeedLogin(1)
                            } else if (res.data == 0) {
                                self.NeedCompleteInfo(1)
                            } else {
                                window.location.href = '/demand/publish'
                            }
                        }
                    })
                } else {
                    this.NeedLogin(1)
                }
            },
            PublishPetent: function () {
                var self = this
                if (this.IsLogin()) {
                    client.Request({
                        type: 'get',
                        url: '/user/complete',
                        success: function (res) {
                            if (res.err_code == '401') {
                                self.NeedLogin(2)
                            } else if (res.data == 0) {
                                self.NeedCompleteInfo(2)
                            } else {
                                window.location.href = '/patent/publish'
                            }
                        }
                    })
                } else {
                    this.NeedLogin(2)
                }
            },
            PublishTech: function () {
                var self = this
                if (this.IsLogin()) {
                    client.Request({
                        type: 'get',
                        url: '/user/complete',
                        success: function (res) {
                            if (res.err_code == '401') {
                                self.NeedLogin(3)
                            } else if (res.data == 0) {
                                self.NeedCompleteInfo(3)
                            } else {
                                window.location.href = '/techshare/publish'
                            }
                        }
                    })
                } else {
                    this.NeedLogin(3)
                }
            },
            PublishProduct:function(){
                var self = this
                if (this.IsLogin()) {
                    var user=client.GetCurrentUser()
                    if(user&&user.IsMerchant){
                        window.location.href = '/seller/publishgood'
                    }else{
                        client.Request({
                            type: 'get',
                            url: '/user/checkuserinfo?type=2',
                            success: function (res) {
                                if (res.err_code == '1301') {
                                    self.NeedLogin(4)
                                } else if (res.err_code == '1303') {
                                    self.NeedMerchant()
                                } else {
                                    user.IsMerchant=true
                                    StorageService.Set("i_login",user)
                                    window.location.href = '/seller/publishgood'
                                }
                            }
                        })
                    }
                }
                else {
                    this.NeedLogin(4)
                }
            }
    }
    }
</script>

<style>
    #ft-quick-publish {
        overflow: visible;
        display: table-cell;
        width: 1%;
        height: 50px;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #444;
    }

        #ft-quick-publish .tab-icon {
            margin-bottom: 0.15rem;
            width: 0.46rem;
            height: 0.46rem;
            position: relative;
            z-index: 20;
            top: 3px;
            padding-top: 0;
            padding-bottom: 0;
            font-family: Muiicons;
            font-size: 0.24px;
            font-weight: 400;
            font-style: normal;
            display: inline-block;
            text-decoration: none;
            -webkit-font-smoothing: antialiased;
        }

        #ft-quick-publish .icon-publish {
            width: 1.16rem !important;
            height: 1.16rem !important;
            top: -0.2rem;
            background: url(./images/plus.png) no-repeat;
            width: 1.16rem;
            height: 1.16rem;
            background-size: 1.16rem 1.16rem;
        }

    #component-quickpublish {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 998;
    }

        #component-quickpublish .shadow {
            z-index: 900;
            background-color: rgba(0, 0, 0, 0.6);
            height: 100%;
            width: 100%;
        }

        #component-quickpublish.show {
            display: block;
        }

        #component-quickpublish .panel .close i {
            display: block;
            background: url(./images/clobig.png) no-repeat center center;
            width: 1.3rem;
            height: 1.3rem;
            background-size: 100%;
            margin: 0 auto;
            padding-top: 1.8rem;
            animation: qpanimate 0.5s linear;
        }

        #component-quickpublish .panel {
            width: 100%;
            margin: 0 auto;
            bottom: 0.25rem;
            
            position: absolute;
        }

            #component-quickpublish .panel ul {
                display: block;
                overflow: hidden;
            }

                #component-quickpublish .panel ul li {
                    width: 25%;
                    float: left;
                    text-align: center;
                    animation: qpanimate 0.5s linear;
                }

                    #component-quickpublish .panel ul li span {
                        display: block;
                    }

                    #component-quickpublish .panel ul li a {
                        color: #fff;
                        font-size: 0.3rem;
                        display: block;
                    }

                        #component-quickpublish .panel ul li a .icon {
                            display: block;
                            width: 1.42rem;
                            height: 1.42rem;
                            border-radius: 1rem;
                            background: #fff;
                            margin: 0 auto;
                        }

                        #component-quickpublish .panel ul li a .text {
                            padding-top: 0.2rem;
                        }

                        #component-quickpublish .panel ul li a i.pic {
                            display: block;
                            width: 0.76rem;
                            height: 0.72rem;
                            margin: 0 auto;
                            padding-top: 1.45rem;
                        }

                        #component-quickpublish .panel ul li a i.demand {
                            background: url(./images/wri.png) no-repeat center center;
                            background-size: 100%;
                        }

                        #component-quickpublish .panel ul li a i.tech {
                            background: url(./images/set.png) no-repeat center center;
                            background-size: 100%;
                        }

                        #component-quickpublish .panel ul li a i.patent {
                            background: url(./images/patenthome.png) no-repeat center center;
                            background-size: 100%;
                        }
                        #component-quickpublish .panel ul li a i.highPublish {
                            background: url(./images/highPublish.png) no-repeat center center;
                            background-size: 100%;
                            width:0.66rem;
                            height:0.64rem
                        }

    .qpanimate {
        animation: myaa 0.5s linear;
    }

    @keyframes qpanimate {
        0% {
            transform: scale(0);
        }

        25% {
            transform: scale(0.25);
        }

        50% {
            transform: scale(0.5);
        }

        75% {
            transform: scale(0.75);
        }

        100% {
            transform: scale(1);
        }
    }

    @-webkit-keyframes qpanimate {
        0% {
            transform: scale(0);
        }

        25% {
            transform: scale(0.25);
        }

        50% {
            transform: scale(0.5);
        }

        75% {
            transform: scale(0.75);
        }

        100% {
            transform: scale(1);
        }
    }
</style>
