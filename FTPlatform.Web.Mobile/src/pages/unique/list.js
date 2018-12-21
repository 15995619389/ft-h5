import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl } from '../../modules/UrlService'
import searchbar from '../../components/searchbar/SearchBar.vue'
import * as StorageService from '../../modules/StorageService'
import scroller from 'vue-scroller'
import footBar from '../../components/foot-nav/foot-nav.vue'
import rightsidebar from "../../components/RightSideBar.vue";


function searchDone() {

}
function appendDone() {

}
var vm = new Vue({
    components: {
        scroller: scroller.Scroller,
        searchbar,
        footBar,
        rightsidebar
    },
    el: '#container',
    data: {
        products: [],
        productType: null,
        param: { pageIndex: 1, sortName: 0, sortDirection: 0, pageSize: 10 },
        TabTitles: ['航天搭载', '军工四证', '航天咨询', '中国制造2025会议', '航天育种', '国防域名注册', '国防实验室认可（Dilac）咨询业务',"航天体验园",'钱学森专题','院士工作站'],
        type: ['', '众智绝活', '企业服务', '航天技术', '行业解决方案', '军民融合', '知识产权', '军民融合'],
        CurrentTab: 0,
        ShowTabs: false,
        PaddingTop: 88,
        Searching: false
    },
    created: function () {
        StorageService.Set('goSearchType', 4)
        this.$data.productType = GetIdFromUrl()
        document.title = this.$data.type[this.$data.productType]
        if (this.$data.productType == 7) {
            this.$data.PaddingTop = 128
        }
        this.Search()
    },
    methods: {
        Get: function (callback) {
            client.Request({
                type: 'get',
                url: '/unique/products/' + this.$data.productType,
                data: this.$data.param,
                success: function (res) {
                    callback(true, res)
                },
                error: function (res) {
                    callback(false)
                }
            })
        },
        TabSwitch: function (tab) {
            var self = this
            self.$data.CurrentTab = tab
            self.$data.ShowTabs = false
        },
        TabClick: function () {
            this.$data.ShowTabs = !this.$data.ShowTabs
        },
        Sort: function (sort) {
            if (sort == this.$data.param.sortName) {
                this.$data.param.sortDirection = this.$data.param.sortDirection == 0 ? 1 : 0
            }
            this.$data.param.sortName = sort
            this.$refs.scroller.scrollTo(0, 0)
            this.$refs.scroller.triggerPullToRefresh()
        },
        Search: function (done) {
            var self = this
            self.$data.Searching = true
            searchDone = done
            self.$data.param.pageIndex = 1
            self.Get(function (success, res) {
                if (success) {
                    for (var i = 0; i < res.Entitys.length; i++) {
                        if (!res.Entitys[i].ImgUrl) {
                            res.Entitys[i].ImgUrl = '/Content/image/MilitaryCivilian/classify2.png'
                        }
                    }
                    vm.$data.products = res.Entitys
                }
                if (searchDone) {
                    searchDone(false)
                }
                self.$data.Searching = false
            })
        },
        Append: function (done) {
            appendDone = done
            if (this.$data.Searching) {
                setTimeout(function () {
                    appendDone(false)
                }, 1000)
                return
            }
            this.$data.param.pageIndex += 1
            this.Get(function (success, res) {
                var noMore = false
                if (success) {
                    var list = res.Entitys
                    if (list && list.length == 0) {
                        noMore = true
                    }
                    for (var i = 0; i < list.length; i++) {
                        vm.$data.products.push(list[i])
                    }
                }
                appendDone(noMore)
            })
        },
        Detail: function (id) {
            window.location.href = '/unique/info/' + id
        },
        GoSpaceBorne: function () {
            window.location.href = '/unique/spaceborne'
        },
        GoMilitaryFour: function () {
            window.location.href = '/unique/militaryfour'
        },
        Redirect: function (url) {
            window.location.href = url
        }
    },
    filters: {
        FormatDate: function (value) {
            if (value != null && value != '') {
                return value.substring(0, 10)
            }
        }
    }
})
