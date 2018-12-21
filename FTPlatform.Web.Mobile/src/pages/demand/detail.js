import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import { GetIdFromUrl } from '../../modules/UrlService'
import { Popup, Toast } from 'mint-ui'
import preview from '../../components/img-preview.vue'
import rigthsidebar from '../../components/RightSideBar.vue'

new Vue({
    el: '#container',
    components: {
        popup: Popup,
        preview,
        rigthsidebar
    },
    data: {
        demand: {BusinessNewCategory:null},
        demands: [],
        ExpectedFinishTime: ['', '1~3个月', '3~6个月', '6~12个月', '>12个月'],
        InputBudget: ['面议', '<1万', '1~10万', '10~50万', '50~200万', '>200万'],
        DockingStatus: ['未对接', '竞标中', '对接成功', '对接完成'],
        RequirementType: ['', '产品研发', '工艺改进', '委托加工', '设备改进', '采购定制', '其他'],
        Solution: ['', '技术咨询', '技术培训', '方案设计', '技术转让/许可', '委托/合作开发', '其他'],
        SolveList: [],
        MySolution: null,
        currentUser: null,
        IsPopupVisiable: false,
        PopupMessage: '',
        PopupUrl: '',
        Button: '我要解决',
        Solveable: true,
        ButtonColor: true
    },
    created: function () {
        // 如果没有ID则返回列表
        if (!GetIdFromUrl()) {
            window.location.href = '/demand'
            return
        }
        this.$data.currentUser = client.GetCurrentUser()
        this.Refresh(false)
    },
    methods: {
        Refresh: function (isAsync) {
            var self = this
            client.Request({
                type: 'get',
                url: '/demands/v2/detail/' + GetIdFromUrl(),
                async: isAsync,
                success: function (result) {
                    // todo: 这里判断如果需求不存在跳转404页面

                    self.$data.demand = result.Content
                    self.ConvertMultiOptionsToArray()
                    if (!self.$data.demand.ImgUrl) {
                        self.$data.demand.ImgUrl =
                            '/Content/image/default/demand.jpg'
                    }
                    if (self.$data.currentUser && self.$data.demand.SolveList) {
                        for (
                            var i = 0;
                            i < self.$data.demand.SolveList.length;
                            i++
                        ) {
                            var item = self.$data.demand.SolveList[i]
                            if (item.UserId == self.$data.currentUser.Id) {
                                self.$data.MySolution = item
                            }
                        }
                    }
                    self.SetButton()
                    self.Recommend()
                },
                error: function (req) {
                    self.Refresh()
                }
            })
        },
        ConvertMultiOptionsToArray: function () {
            var self = this
            if (self.$data.demand.RequirementType) {
                self.$data.demand.RequirementType = self.$data.demand.RequirementType.split(
                    ','
                )
            } else {
                self.$data.demand.RequirementType = []
            }
            if (self.$data.demand.Solution) {
                self.$data.demand.Solution = self.$data.demand.Solution.split(
                    ','
                )
            } else {
                self.$data.demand.Solution = []
            }
        },
        ShowPreview: function () {
            this.$refs.preview.Show(this.$data.demand.ImgUrl)
        },
        SetButton: function () {
            var self = this
            if (
                self.$data.currentUser &&
                self.$data.currentUser.Id == self.$data.demand.UserId
            ) {
                self.$data.Button = '我的需求'
                self.$data.Solveable = false
                self.$data.ButtonColor = false
                return
            }
            if (
                self.$data.demand.DockingStatus == 3 ||
                self.$data.demand.IsExpire ||
                self.$data.demand.AuditingStatus == 10
            ) {
                self.$data.Button = '对接完成'
                self.$data.Solveable = false
                self.$data.ButtonColor = false
                return
            }
            if (self.$data.demand.DockingStatus == 2) {
                self.$data.Button = '对接成功'
                self.$data.Solveable = false
                self.$data.ButtonColor = false
                return
            }

            self.$data.Button = '我要解决'
            self.$data.Solveable = true
            self.$data.ButtonColor = true
        },
        Recommend: function () {
            var self = this
            client.Request({
                type: 'get',
                url: '/demands/' + self.$data.demand.Id + '/recommend',
                success: function (res) {
                    if (res.Entitys) {
                        for (var i = 0; i < res.Entitys.length; i++) {
                            if (self.$data.demands.length < 6) {
                                var item = res.Entitys[i]
                                if (!item.ImgUrl) {
                                    item.ImgUrl =
                                        '/Content/image/default/demand.jpg'
                                }
                                self.$data.demands.push(item)
                            } else {
                                break
                            }
                        }
                    }
                    //if (self.$data.demands.length < 6) {
                    //    self.Recommend()
                    //}
                }
            })
        },
        Detail: function (id) {
            window.location.href = '/demand/detail/' + id
        },
        Solve: function () {
            if (!this.$data.Solveable) {
                return
            }
            if (this.$data.currentUser) {
                this.GetPermission()
            } else {
                this.PopupLogin()
            }
        },
        GetPermission: function () {
            var self = this
            client.Request({
                type: 'get',
                url: '/demands/' + this.$data.demand.Id + '/permission',
                success: function (res) {
                    if (res.err_code == '200') {
                        window.location.href =
                            '/demand/solve/' + self.$data.demand.Id + '?istech=' + self.IsTechDemand();
                    } else if (res.err_code == '400') {
                        if (res.err_msg == 'expert') {
                            self.PopupExpert()
                        } else if (res.err_msg === 'apply') {
                            Toast({ message: '您已申请过解决该需求！', duration: 1000 })
                        } else {
                            Toast({ message: '操作失败！', duration: 1000 })
                        }
                    } else if (res.err_code == '401') {
                        self.PopupLogin()
                    } else {
                        Toast({ message: '操作失败！', duration: 1000 })
                    }
                }
            })
        },
        Follow: function () {
            var self = this
            if (!self.$data.currentUser) {
                self.PopupLogin()
                return
            }
            client.Request({
                type: 'post',
                url: '/demands/' + this.$data.demand.Id + '/follow',
                success: function (res) {
                    if (res.err_code == '401') {
                        self.PopupLogin()
                    }
                    if (res.err_code == '400') {
                        Toast({ message: '无法关注自己发布的内容！', duration: 1000 })
                    }
                    if (res.err_code == '200') {
                        self.$data.demand.IsFollowed = !self.$data.demand
                            .IsFollowed
                        if (self.$data.demand.IsFollowed) {
                            Toast({ message: '关注成功！', duration: 1000 })
                        } else {
                            Toast({ message: '取消成功！', duration: 1000 })
                        }
                    }
                    if (res.err_code == '500') {
                        Toast({ message: '关注失败！', duration: 1000 })
                    }
                }
            })
        },
        // Popup 相关
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
                encodeURIComponent('/demand/detail/' + this.$data.demand.Id)
            this.$data.IsPopupVisiable = true
        },
        PopupExpert: function () {
            this.$data.PopupMessage = '您还不是供方用户，成功申请供方才能解决需求！'
            this.$data.PopupUrl =
                '/expert/applysupplier?returnurl=' +
                encodeURIComponent('/demand/detail/' + this.$data.demand.Id)
            this.$data.IsPopupVisiable = true
        },
        IsTechDemand: function () {
            var demand = this.$data.demand;
            if(demand.BusinessNewCategory && demand.BusinessNewCategory.BusinessClassLevel1){
                if(demand.BusinessNewCategory.BusinessClassLevel1 == '1289'
                    || demand.BusinessNewCategory.BusinessClassLevel1 == '1297'
                    || demand.BusinessNewCategory.BusinessClassLevel1 == '1303'
                    || demand.BusinessNewCategory.BusinessClassLevel1 == '1309'
                    || demand.BusinessNewCategory.BusinessClassLevel1 == '1312'
                    ) {
                    return false;
                }
            }
            return true;
        }
    }
})
