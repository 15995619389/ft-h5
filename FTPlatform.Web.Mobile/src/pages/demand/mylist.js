import * as client from '../../modules/ApiClient'
import scroller from 'vue-scroller'
import Vue from 'vue'
import * as StatusService from '../../modules/StatusService'

function appendDone() {

}
function SearchDone() {

}

var messages = [
    '',
    '确认删除该需求？',
    '您确定要终止当前项目吗？',
    '确认提交该需求',
    '您确定要确认项目终止吗？',
    '您确定要拒绝项目终止吗？',
    '确定要给供方支付此笔款项吗？',
    '非常抱歉，更多操作请至飞天众智电脑端网站进行。给您带来不便敬请谅解'
]

new Vue({
    el: '#container',
    components: {
        scroller: scroller.Scroller
    },
    data: {
        param: { pageIndex: 1, pageSize: 10, status: null },
        demands: [],
        InputBudget: ['<1万', '1~10万', '10~50万', '50~200万', '>200万'],
        IsSearching: false,
        currentUser: null,
        PanelMessage: '',
        IsPanelVisiable: false,
        currentDemand: null,
        IsUnsupportPanelVisiable: false,
        DemandStatus: StatusService.DemandStatus,
        IsMoreStatusPanelVisibale: false,
        PanelType: null,
        PanelTypes: {
            Delete: 1,
            ApplyTermination: 2,
            Submit: 3,
            ConfirmTermination: 4,
            RefuseTermination: 5,
            ConfirmPayment: 6,
            Unsupport: 7
        },
        ButtonTypes: {
            Edit: 0,
            Delete: 1,
            Submit: 2,
            ChangeSupplier: 3,
            ChooseSupplier: 4,
            AuditContract: 5,
            ApplyTermination: 6,
            Pay: 7,
            ConfirmFinish: 8,
            Critique: 9,
            ConfirmPayment: 10,
            ConfirmTermination: 11,
            RefuseTermination: 12
        }
    },
    created: function () {
        var self = this
        self.IsLogin()
    },
    mounted: function () { },
    methods: {
        Get: function (callback) {
            var self = this
            client.Request({
                type: 'get',
                url: '/demands/personal/' + self.$data.currentUser.Id,
                data: self.$data.param,
                success: function (res) {
                    callback(true, res)
                },
                error: function (res) {
                    callback(false)
                }
            })
        },
        IsLogin: function () {
            var self = this
            if (!self.$data.currentUser) {
                var user = client.GetCurrentUser()
                if (!user) {
                    window.location.href = '/passport/login'
                    return false
                }
                self.$data.currentUser = user
                return true
            }
            return true
        },
        ToggleMoreStatusPanel: function () {
            this.$data.IsMoreStatusPanelVisibale = !this.$data
                .IsMoreStatusPanelVisibale
        },
        Search: function (done) {
            var self = this
            self.$data.IsSearching = true
            SearchDone = done
            self.$data.param.pageIndex = 1
            if (self.IsLogin()) {
                self.Get(function (success, res) {
                    if (success) {
                        if (res.err_code == '401') {
                            window.location.href = '/passport/login'
                        } else if (res.err_code == '200') {
                            self.$data.demands = res.data.Entitys
                        } else if (res.err_code == '400') {
                            window.location.href = '/mybusiness/'
                        }
                    }
                    self.$data.IsSearching = false
                    if (SearchDone) {
                        SearchDone()
                    }
                })
            }
        },
        Refresh: function () {
            this.$refs.scroller.scrollTo(0, 0)
            this.$refs.scroller.triggerPullToRefresh()
        },
        Filt: function (status) {
            var self = this
            self.$data.IsMoreStatusPanelVisibale = false
            self.$data.param.status = status
            this.$refs.scroller.scrollTo(0, 0)
            this.$refs.scroller.triggerPullToRefresh()
        },
        Append: function (done) {
            var self = this
            appendDone = done
            if (self.$data.IsSearching) {
                if (appendDone) {
                    appendDone()
                }
                return
            }
            if (self.$data.demands.length) {
                self.$data.param.pageIndex += 1
            } else {
                self.$data.param.pageIndex = 1
            }
            if (self.IsLogin()) {
                self.Get(function (success, res) {
                    var noMore = false
                    if (success) {
                        if ((res.err_code == '200')) {
                            var list = res.data.Entitys
                            if (list && list.length == 0) {
                                noMore = true
                            }
                            for (var i = 0; i < list.length; i++) {
                                self.$data.demands.push(list[i])
                            }
                        }
                    }
                    appendDone(noMore)
                })
            }
        },
        Detail: function (demand) {
            if (demand.AuditingStatus == 99) {
                window.location.href = '/demand/publish/' + demand.Id
            } else {
                window.location.href =
                    '/demand/publishdemanddetail/' + demand.Id
            }
        },
        Edit: function (demand) {
            window.location.href = '/demand/publish/' + demand.Id
        },
        Critique: function (demand) {
            window.location.href = '/demand/Critique/' + demand.Id
        },
        ShowPanel: function (type, demand) {
            var self = this
            self.$data.PanelType = type
            self.$data.currentDemand = demand
            self.$data.PanelMessage = messages[type]
            self.$data.IsPanelVisiable = true
            self.$data.IsUnsupportPanelVisiable = false
        },
        Confirm: function () {
            var self = this
            self.$data.IsPanelVisiable = false
            $('body').removeClass('body-overflow')
            var types = self.$data.PanelTypes
            if (self.IsLogin()) {
                if (self.$data.PanelType == types.Delete) {
                    self.Delete()
                }
                if (self.$data.PanelType == types.ApplyTermination) {
                    self.ApplyTermination()
                }
                if (self.$data.PanelType == types.Submit) {
                    self.Submit()
                }
                if (self.$data.PanelType == types.ConfirmTermination) {
                    self.ConfirmTermination()
                }
                if (self.$data.PanelType == types.RefuseTermination) {
                    self.RefuseTermination()
                }
                if (self.$data.PanelType == types.ConfirmPayment) {
                    self.ConfirmPayment()
                }
            }
        },
        Delete: function () {
            var self = this
            client.Request({
                type: 'post',
                url: '/demands/' + self.$data.currentDemand.Id + '/delete',
                data: {},
                success: function (res) {
                    if (res.err_code == '200') {
                        self.Refresh()
                    }
                },
                complete: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        ApplyTermination: function () {
            var self = this
            client.Request({
                type: 'post',
                url: '/demands/termination?id=' + self.$data.currentDemand.Id,
                success: function (res) {
                    if (res.Flag) {
                        self.Refresh()
                    }
                },
                complte: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        Submit: function () {
            var self = this
            self.$data.currentDemand.AuditingStatus = 1
            client.Request({
                type: 'post',
                data: self.$data.currentDemand,
                url: '/demands',
                success: function (res) {
                    if (res.data) {
                        self.Refresh()
                    }
                },
                complete: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        ConfirmTermination: function () {
            var self = this
            client.Request({
                type: 'post',
                url:
                '/demands/opttermination?type=1&id=' +
                self.$data.currentDemand.Id,
                success: function (res) {
                    if (res.Flag) {
                        self.Refresh()
                    }
                },
                complete: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        RefuseTermination: function () {
            var self = this
            client.Request({
                type: 'post',
                url:
                '/demands/opttermination?type=2&id=' +
                self.$data.currentDemand.Id,
                success: function (res) {
                    if (res.Flag) {
                        self.Refresh()
                    }
                },
                complete: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        ConfirmPayment: function () {
            var self = this
            client.Request({
                type: 'post',
                url: '/demands/verifypayment?id=' + self.$data.currentDemand.Id,
                success: function (res) {
                    if (res.Flag) {
                        self.Refresh()
                    }
                },
                complete: function () {
                    self.$data.currentDemand = null
                }
            })
        },
        UnsupportOperation: function () {
            this.$data.IsPanelVisiable = false
            this.$data.IsUnsupportPanelVisiable = true
        },
        Cancel: function () {
            this.$data.currentDemand = null
            this.$data.IsPanelVisiable = false
            this.$data.IsUnsupportPanelVisiable = false
        },
        IsButtonVisiable: function (btn, need) {
            var self = this
            var btns = this.$data.ButtonTypes
            var DemandStatus = this.$data.DemandStatus
            if (need.DemandTermination && need.DemandTermination.Status != 2) {
                return false
            }
            if (btn == btns.ChangeSupplier) {
                return (
                    (need.AuditingStatus == DemandStatus.Docked ||
                        need.AuditingStatus == DemandStatus.StayContract ||
                        need.AuditingStatus == DemandStatus.NotContracted) &&
                    need.SolveList &&
                    need.SolveList.length > 1
                )
            }
            if (btn == btns.ChooseSupplier) {
                return need.AuditingStatus == 2 && need.SolveList.length != 0
            }
            if (btn == btns.AuditContract) {
                return need.AuditingStatus == DemandStatus.StayContract
            }
            if (btn == btns.ApplyTermination) {
                return (
                    (need.AuditingStatus == DemandStatus.Docked ||
                        need.AuditingStatus == DemandStatus.StayContract ||
                        need.AuditingStatus == DemandStatus.Ongoing ||
                        need.AuditingStatus == DemandStatus.Agreement ||
                        need.AuditingStatus == DemandStatus.Contracted ||
                        need.AuditingStatus == DemandStatus.ConfirmOver ||
                        need.AuditingStatus == DemandStatus.NotContracted) &&
                    !self.IsButtonBoxVisibale(3, need) &&
                    (!need.DemandTermination || need.DemandTermination.Status == 2)
                )
            }
            if (btn == btns.Pay) {
                return (
                    need.AuditingStatus == DemandStatus.Contracted &&
                    !self.IsButtonBoxVisibale(3, need)
                )
            }
            if (btn == btns.ConfirmFinish) {
                return need.AuditingStatus == DemandStatus.ConfirmOver
            }
            if (btn == btns.Critique) {
                return need.AuditingStatus == DemandStatus.Finished
            }
            if (btn == btns.ConfirmPayment) {
                return (
                    need.InformPayMoneyModel != null &&
                    need.InformPayMoneyModel.DemandState == 0 &&
                    (need.AuditingStatus == DemandStatus.Ongoing ||
                        need.AuditingStatus == DemandStatus.Finished ||
                        need.AuditingStatus == DemandStatus.Evaluated ||
                        need.AuditingStatus == DemandStatus.ConfirmOver)
                )
            }
            return false
        },
        IsButtonBoxVisibale: function (box, need) {
            var self = this
            if (box == 1) {
                return (
                    self.IsButtonBoxVisibale(2, need) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.ChangeSupplier,
                        need
                    ) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.ChooseSupplier,
                        need
                    ) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.AuditContract,
                        need
                    ) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.ApplyTermination,
                        need
                    ) ||
                    self.IsButtonVisiable(self.$data.ButtonTypes.Pay, need) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.ConfirmFinish,
                        need
                    ) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.Critique,
                        need
                    ) ||
                    self.IsButtonVisiable(
                        self.$data.ButtonTypes.ConfirmPayment,
                        need
                    )
                )
            }
            if (box == 2) {
                return (
                    need.AuditingStatus ==
                    self.$data.DemandStatus.AduitFailed ||
                    need.AuditingStatus == self.$data.DemandStatus.Draft
                )
            }
            if (box == 3) {
                return (
                    need.DemandTermination != null &&
                    need.DemandTermination.UserType == 2 &&
                    need.DemandTermination.Status == 0
                )
            }
            return false
        }
    },
    filters: {
        FormatDate: function (value) {
            if (value != null && value != '') {
                return value.substring(0, 10)
            }
        },
        fAuditingStatus: function (val) {
            if (val == 1) return '待审核'
            if (val == 2) return '已发布'
            if (val == 3) return '对接中'
            if (val == 4) return '合同待审核'
            if (val == 5 || val == 7 || val == 16) return '项目进行中'
            if (val == 8) return '项目完成'
            if (val == 9) return '已评价'
            if (val == 10) return '已终止'
            if (val == 21) return '未通过审核'
            if (val == 22) return '合同已拒绝'
            if (val == 99) return '待提交'
        }
    }
})
