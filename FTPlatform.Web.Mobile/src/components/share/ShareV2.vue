<script>
import NativeShare from 'nativeshare'
import { Toast } from 'mint-ui'

export default {
    name: 'share',
        data: function () {
            return {
                nativeShare: {},
                shareoverlay: false,
                sharewrapper: false,
                downPrompt: false,
                rightPrompt: false,
                defaultOptions:{
                    //图标无效存在
                    icon:'',
                    // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
                    link: window.location.href,
                    title: document.title,
                    desc: '',
                    from: '@fa-ge',
                    // 不要过于依赖以下两个回调，很多浏览器是不支持的
                    success: function () {
                        Toast({ message: '分享成功', duration: 1000 })
                    },
                    fail: function () {
                        Toast({ message: '分享失败', duration: 1000 })
                    }
                },
                wechatDefaultOptions:{
                    appId: '',
                    timestamp: '',
                    nonceStr: '',
                    signature: ''
                }
            }
        },
    methods: {
            Init: function (options,wechatOptions) {
                var self = this
                self.$data.nativeShare = new NativeShare()

                $.extend(self.$data.defaultOptions, options)
                self.$data.nativeShare.setShareData(self.$data.defaultOptions)
                if(wechatOptions){
                    $.extend(self.$data.wechatDefaultOptions, wechatOptions)
                    self.$data.nativeShare.setConfig({wechatConfig:self.$data.wechatDefaultOptions})
                }
            },
            Show: function () {
                var self = this
                if (self.isbaidu()) {
                    self.call('wechatFriend')
                    return
                }
                if (self.isWeiXin()) {
                    self.$data.shareoverlay = true
                    self.$data.rightPrompt = true
                    return
                }
                self.$data.shareoverlay = true
                self.$data.sharewrapper = true
            },
            Cancel: function () {
                if (this.$data.shareoverlay) {
                    this.$data.shareoverlay = false
                }
                if (this.$data.sharewrapper) {
                    this.$data.sharewrapper = false
                }
                if (this.$data.rightPrompt) {
                    this.$data.rightPrompt = false
                }
                if (this.$data.downPrompt) {
                    this.$data.downPrompt = false
                }
            },
            PromptCancel: function () {
                if (this.$data.shareoverlay) {
                    this.$data.shareoverlay = false
                }
                if (this.$data.rightPrompt) {
                    this.$data.rightPrompt = false
                }
                if (this.$data.downPrompt) {
                    this.$data.downPrompt = false
                }
            },
            call: function (command) {
                var self = this
                try {
                    self.$data.nativeShare.call(command)
                } catch (err) {
                    self.Cancel()
                    if ((command == 'wechatFriend' || command == 'wechatTimeline') && ((self.isSafari() && self.isIphone()) || self.isAndroid())) {
                        self.$data.downPrompt = true
                        self.$data.shareoverlay = true
                        return
                    }
                    if ((command == 'qqFriend' || command == 'qZone') && ((self.isSafari() && self.isIphone()) || self.isAndroid())) {
                        return
                    }
                    Toast({ message: '请将链接粘贴发送给你的好友', duration: 2000 })
                }
            },
            isWeiXin: function () {
                var ua = window.navigator.userAgent.toLowerCase()
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true
                } else {
                    return false
                }
            },
            isbaidu: function () {
                var ua = window.navigator.userAgent.toLowerCase()
                if (ua.indexOf('baidu') > 0) {
                    return true
                } else {
                    return false
                }
            },
            isSafari: function () {
                var ua = window.navigator.userAgent
                if (ua.indexOf('Safari') != -1 && ua.indexOf('Version') != -1) {
                    return true
                } else {
                    return false
                }
            },
            isIphone: function () {
                var ua = window.navigator.userAgent
                const isIpad = /(iPad).*OS\s([\d_]+)/.test(ua)
                if (!isIpad && /(iPhone\sOS)\s([\d_]+)/.test(ua)) {
                    return true
                } else {
                    return false
                }
            },
            isAndroid: function () {
                var ua = window.navigator.userAgent
                if (/(Android);?[\s]+([\d.]+)?/.test(ua)) {
                    return true
                } else {
                    return false
                }
            }
    }
    }
</script>

<template>
    <div>
        <!--分享页面-->
        <div class="share-overlay" v-if="shareoverlay" v-on:click="Cancel"></div>
        <div class="share-wrapper share-show" v-if="sharewrapper">
            <h2>分享到</h2>
            <div class="share-list">
                <div class="c-tool-btn wa-image-entity" id="wechatFriend" v-on:click="call('wechatFriend')">
                    <img class="c-img" src="./images/wxfriend_2.png">
                    <span class="c-gap-top c-line-clamp1">微信好友</span>
                </div>
                <div class="c-tool-btn wa-image-entity" id="wechatTimeline" v-on:click="call('wechatTimeline')">
                    <img class="c-img" src="./images/pyq_2.png">
                    <span class="c-gap-top c-line-clamp1">微信朋友圈</span>
                </div>
                <div class="c-tool-btn wa-image-entity" id="qqFriend" v-on:click="call('qqFriend')">
                    <img class="c-img" src="./images/qqfriend_2.png">
                    <span class="c-gap-top c-line-clamp1">QQ好友</span>
                </div>
                <div class="c-tool-btn wa-image-entity" id="qZone" v-on:click="call('qZone')">
                    <img class="c-img" src="./images/qzone_2.png">
                    <span class="c-gap-top c-line-clamp1">QQ空间</span>
                </div>
                <div class="c-tool-btn wa-image-entity" id="weibo" v-on:click="call('weibo')">
                    <img class="c-img" src="./images/sinaweibo_2.png">
                    <span class="c-gap-top c-line-clamp1">新浪微博</span>
                </div>
            </div>
            <a class="share-cancel" id="share-cancel" v-on:click="Cancel"></a>
        </div>
        <!--点击下方分享-->
        <div class="sharing-hint" v-show="downPrompt" v-on:click="PromptCancel">
            <p>
                <span>点击浏览器下方“</span><img src="./images/sharing-hint2.png" class="oimg">
                <span>”分享给好友，</span>
            </p>
            <p style="width: 240px;">
                <span>Safari浏览器请点击“</span><img src="./images/sharing-hint1.png" class="aimg" />
                <span>”按钮！</span>
            </p>
            <img src="./images/sharing-down.png" class="sharing-down">
        </div>
        <!--点击右上角分享-->
        <div class="right-sharing" v-show="rightPrompt" v-on:click="PromptCancel">
            <img src="./images/right-sharing.png" class="right-bg" />
            <p>点击右上角,</p>
            <p>分享到微信好友、朋友圈或QQ</p>
        </div>
    </div>
</template>

<style>
    .share-overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 99;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.8);
    }

    .wx-tip-ms {
        background: url(https://gss0.bdstatic.com/7051cy7z2RZ3otebn9fN2DJv/static/m-common/widget/js/logic/share/img/b_8489c9b.png) no-repeat;
        width: 165px;
        height: 70px;
        background-size: contain;
        margin: 10px 18px 0 auto;
        line-height: 24px;
        color: #efefef;
        text-align: center;
        padding-top: 35px;
    }

    .share-wrapper {
        position: fixed;
        z-index: 9999;
        width: 100%;
        bottom: -203px;
        height: 130px;
        background: #fff;
        -webkit-transition: bottom 0.1s;
    }

        .share-wrapper h2 {
            padding: 7px 0 7px;
            font-size: 0.4rem;
            line-height: 1;
            text-align: center;
            font-weight: 400;
            font-size:14px
        }

    .share-wrapper-inner {
        position: relative;
    }

    .share-show {
        bottom: 0;
    }

    .share-list {
        text-align: center;
        background-color: #f1f1f1;
        height: 80%;
    }

    .share-item {
        display: inline-block;
        text-align: center;
        color: #333;
        width: 65px;
        height: auto;
        overflow: hidden;
        margin-left: 2px;
        font-size: 11px;
    }

        .share-item:first-child {
            margin-left: 0;
        }

    .share-cancel {
        width: 17px;
        height: 17px;
        display: block;
        top: 12px;
        right: 20px;
        position: absolute;
    }

        .share-cancel:before {
            height: 17px;
            content: "";
            border-left: 1px solid #666;
            position: absolute;
            width: 0;
            left: 10px;
            -webkit-transform: rotate(-45deg);
        }

        .share-cancel:after {
            height: 17px;
            content: "";
            border-left: 1px solid #666;
            position: absolute;
            width: 0;
            left: 10px;
            -webkit-transform: rotate(45deg);
        }

    .c-tool-btn {
        margin-top: 15px;
        width: 16%;
        margin-right: 1%;
        flex: 1 1 auto;
        color: #666;
        text-align: center;
        font-size: 0.2rem;
    }

    .wa-image-entity {
        display: inline-block;
    }

    .c-tool-btn .c-img {
        width: 80%;
        margin: 0 auto;
        background: #fff;
        border-radius: 50%;
        width:0.80rem
    }

    .c-tool-btn .c-gap-top {
        display: block;
        margin-top: 8px;
        font-size: 0.20rem;
        line-height: 1;
    }

    /*@font-face {
        font-family: 'new-fontSize';
        src: url('./fonts/new-fontSize.ttf') format('truetype');
    }*/

    .sharing-hint span {
        display: block;
        float: left;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        font-family: "new-fontSize";
    }

    .right-bg {
        width: 1.45rem;
        height: 1.44rem;
        float: right;
    }

    .sharing-hint {
        text-align: center;
        /*width: 260px;*/
        height: 4rem;
        position: fixed;
        bottom: 1%;
        left: 45%;
        z-index: 111;
        margin-left: -130px;
        margin-top: -1.5rem;
    }

        .sharing-hint p {
            width: 100% !important;
        }

    .right-sharing {
        z-index: 111;
        position: fixed;
        top: 10px;
        right: 5%;
        /*width: 100%;*/
    }

        .sharing-hint p,
        .right-sharing p {
            overflow: hidden;
            height: auto;
            width: 100%;
            font-size: 16px;
            margin: 0 auto;
            color: #fff;
            text-align: center;
            margin-bottom: 10px;
            font-family: "new-fontSize";
            line-height: 20px;
        }

        .right-sharing p {
            font-size: 18px;
            font-weight: 600;
        }

    .oimg {
        width: 0.35rem;
        height: 0.3rem;
        float: left;
        max-height: 0.3rem;
    }

    .aimg {
        width: 0.32rem;
        height: 0.4rem;
        float: left;
    }

    .sharing-down {
        width: 1.35rem;
        height: 2.66rem;
        margin-left: 46%;
    }
</style>
