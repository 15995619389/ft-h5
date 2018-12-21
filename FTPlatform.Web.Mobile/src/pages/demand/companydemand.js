import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import * as StorageService from '../../modules/StorageService'
import scroller from 'vue-scroller'
import searchbar from '../../components/searchbar/SearchBar.vue'
import FilterService from '../../modules/FilterService.js'
import foot from '../../components/foot-nav-sm/foot-nav-sm-untech.vue'
import rightsidebar from '../../components/RightSideBar.vue'

function appendDone() {

}
function SearchDone() {

}
$('body').on('touchmove', function (e) {
    if (!$('.l-scrollable').has($(e.target)).length) {
        e.preventDefault()
    }
})
Vue.filter('InputBudget', function (val) {
    var inputBudget = ['面议', '<1万', '1~10万', '10~50万', '50~200万', '>200万']
    return inputBudget[val]
})
var vm = new Vue({
    components: {
        scroller: scroller.Scroller,
        searchbar,
        foot: foot,
        rightsidebar
        },
    el: '#container',
    data: {
        demands: [],
        dockStatus: ['未对接', '竞标中', '对接成功', '对接完成'],
        param: {
            pageIndex: 1,
            pageSize: 10,
            DateRange: null,
            maxFollowNum: null,
            minFollowNum: null,
            inputBudget: null,
            dockStatus: null,
            sortName: 0,
            sortDirection: 0
        },
        dockStatusPannel: false,
        filtPannel: false
    },
    created: function () {
        StorageService.Set('goSearchType', 0)
    },
    mounted: function () {
        var self = this
        self.$refs.foot.Init(self.PickCategory)
    },
    methods: {
        Get: function (callback) {
            client.Request({
                type: 'get',
                url: '/demands/companyservicedemands',
                data: this.$data.param,
                success: function (res) {
                    callback(true, res)
                },
                error: function (res) {
                    callback(false)
                }
            })
        },
        Refresh: function () {
            this.$refs.scroller.scrollTo(0, 0)
            this.$refs.scroller.triggerPullToRefresh()
        },
        DockStatus: function () {
            this.$data.dockStatusPannel = !this.$data.dockStatusPannel
        },
        FiltPannel: function () {
            this.$data.filtPannel = !this.$data.filtPannel
        },
        HidePannel: function () {
            this.$data.filtPannel = false
        },
        ChangeFollowNum: function (min, max) {
            this.$data.param.minFollowNum = min
            this.$data.param.maxFollowNum = max
        },
        ChangeDateRange: function (day) {
            this.$data.param.DateRange = day
        },
        ResetFilt: function () {
            this.$data.param.inputBudget = null
            this.$data.param.minFollowNum = null
            this.$data.param.maxFollowNum = null
            this.$data.param.DateRange = null
        },
        ConfirmFilt: function () {
            this.$data.filtPannel = !this.$data.filtPannel
            this.Refresh()
        },
        DockSort: function (status) {
            this.$data.param.dockStatus = status
            this.$data.dockStatusPannel = !this.$data.dockStatusPannel
            this.Refresh()
        },
        Sort: function (sort) {
            if (sort == this.$data.param.sortName) {
                this.$data.param.sortDirection =
                    this.$data.param.sortDirection == 0 ? 1 : 0
            }
            this.$data.param.sortName = sort
            this.Refresh()
        },
        Search: function (done) {
            var self = this
            SearchDone = done
            self.$data.param.pageIndex = 1
            self.Get(function (success, res) {
                if (success) {
                    vm.$data.demands = res.Content.Entitys
                }
                if (SearchDone) {
                    SearchDone()
                }
            })
        },
        PickCategory: function (arr) {
            var param = {}
            param.categoryLv1 = arr[0] && arr[0].Id ? arr[0].Id : 0
            param.categoryLv2 = arr[1] && arr[1].Id ? arr[1].Id : 0
            param.categoryLv3 = arr[2] && arr[2].Id ? arr[2].Id : 0
            $.extend(this.$data.param, param)
            this.Refresh()
        },
        Append: function (done) {
            appendDone = done
            var noMore = false
            this.$data.param.pageIndex = this.$data.demands.length
                ? this.$data.param.pageIndex + 1
                : 1
            this.Get(function (success, res) {
                if (success) {
                    var list = res.Content.Entitys
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            vm.$data.demands.push(list[i])
                        }
                    } else {
                        noMore = true
                    }
                }
                appendDone(noMore)
            })
        },
        Detail: function (id) {
            window.location.href = '/demand/detail/' + id
        }
    },
    filters: FilterService.filters
})
