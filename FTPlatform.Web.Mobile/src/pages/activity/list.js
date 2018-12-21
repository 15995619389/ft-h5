import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import foot from '../../components/foot-nav/foot-nav.vue'
import scroller from 'vue-scroller'
import { Toast } from 'mint-ui'

function appendDone() {

}
function SearchDone() {

}

var vm = new Vue({
    components: {
        scroller: scroller.Scroller,
        foot
    },
    el: '.mui-content',
    data: {
        activities: [],
        param: { pageIndex: 0, pageSize: 10 },
        isOnline: true,
        time: null
    },
    methods: {
        Refresh: function (done) {
            this.Search(done)
        },
        Online: function () {
            this.$data.isOnline = true
            this.$children[0].scrollTo(0, 0)
            this.$children[0].triggerPullToRefresh()
        },
        Offline: function () {
            this.$data.isOnline = false
            this.$children[0].scrollTo(0, 0)
            this.$children[0].triggerPullToRefresh()
        },
        UPdateParam: function () {
            if (this.$data.isOnline) {
                this.$data.param.type = 0
            } else {
                this.$data.param.type = 1
            }
        },
        Get: function (callback) {
            client.Request({
                type: 'get',
                url: '/activities',
                data: this.$data.param,
                success: function (res) {
                    if (res.err_code == '400') {
                        callback(false)
                    } else {
                        callback(true, res)
                    }
                },
                error: function (res) {
                    callback(false)
                }
            })
        },
        Search: function (done) {
            SearchDone = done
            this.UPdateParam()
            this.$data.param.pageIndex = 1
            var thisDate=new Date();
            this.$data.time =thisDate.getFullYear()+"-"+(thisDate.getMonth()+1)+"-"+thisDate.getDate()+"T"+thisDate.getHours()+":"+thisDate.getMinutes()+":"+thisDate.getSeconds(); //thisDate()
            this.Get(function (sucess, res) {
                if (sucess) {
                    vm.$data.activities = res.data.Entitys
                }
                if (SearchDone) {
                    SearchDone()
                }
            })
        },
        Append: function (done) {
            appendDone = done
            this.UPdateParam()
            this.$data.param.pageIndex += 1
            var thisDate=new Date();
            this.$data.time =thisDate.getFullYear()+"-"+(thisDate.getMonth()+1)+"-"+thisDate.getDate()+"T"+thisDate.getHours()+":"+thisDate.getMinutes()+":"+thisDate.getSeconds(); //thisDate()
            this.Get(function (sucess, res) {
                if (sucess) {
                    var list = res.data.Entitys
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            vm.$data.activities.push(list[i])
                        }
                        appendDone()
                    } else {
                        appendDone(true)
                    }
                } else {
                    appendDone()
                }
            })
        },
        GoDetail: function (entity) {
            var thisDate=new Date();
            var actStartDate=new Date(entity.StartTime.replace(/T/g," ").replace(/-/g,"/"));
            var actStopDate=new Date(entity.TerminationTime.replace(/T/g," ").replace(/-/g,"/"));

            if (thisDate > actStartDate && thisDate < actStopDate && entity.PageLink != null && entity.PageLink!="") {
                window.location.href = entity.PageLink;
            } else if (thisDate < entity.StartTime) {
                Toast({ message: '活动暂未开始！', duration: 1000 })
            } else if (thisDate > entity.TerminationTime) {
                Toast({ message: '活动已结束！', duration: 1000 })
            } else {
                Toast({ message: '暂时无法查看！', duration: 1000 })
            }
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
function thisDate() {
    var myDate = new Date()
    // 获取当前年
    var year = myDate.getFullYear()
    // 获取当前月
    var month = myDate.getMonth() + 1
    // 获取当前日
    var date = myDate.getDate()
    var h = myDate.getHours() // 获取当前小时数(0-23)
    var m = myDate.getMinutes() // 获取当前分钟数(0-59)
    var s = myDate.getSeconds()

    return year + '-' + p(month) + '-' + p(date) + ' ' + p(h) + ':' + p(m) + ':' + p(s)
}
function p(s) {
    return s < 10 ? '0' + s : s
}
