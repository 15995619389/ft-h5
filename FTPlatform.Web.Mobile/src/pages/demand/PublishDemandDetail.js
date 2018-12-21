import * as client from '../../modules/ApiClient'
import Vue from 'vue'

Vue.filter('as', function (val) {
    if (val == 1) { return '待审核' }
    if (val == 2) { return '已发布' }
    if (val == 3) { return '对接中' }
    if (val == 4) { return '合同待审核' }
    if (val == 5 || val == 7 || val == 16) { return '项目进行中' }
    if (val == 8) { return '项目完成' }
    if (val == 9) { return '已评价' }
    if (val == 10) { return '已终止' }
    if (val == 21) { return '未通过审核' }
    if (val == 22) { return '合同已拒绝' }
    if (val == 99) { return '待提交' }
})
Vue.filter('ps', function (val) {
    if (val == 1) { return '需求信息公开，公司名不公开' }
    if (val == 2) { return '需求信息公开，公司名公开' }
    if (val == 3) { return '需求信息不公开，委托平台处理' }
})
Vue.filter('subl', function (val) {
    if (val && val.length > 18) { return val.substring(0, 18) + '…' } else { return val }
})
var vm = new Vue({
    el: '.mui-content',
    data: {
        demand: {BusinessNewCategory:null},
        category: '',
        SolveList: {},
        SolveModel: {},
        RequirementTypeView: '',
        SolutionView: '',
        id: null,
        ExpectedFinishTime: ['', '1~3个月', '3~6个月', '6~12个月', '>12个月'],
        InputBudget: ['面议', '<1万', '1~10万', '10~50万', '50~200万', '>200万'],
        Status: ['申请中', '已淘汰', '待上传合同', '对接中', '对接完成', '已终止', '已评价']
    },
    methods: {
        Init: function () {
            this.$data.id = GetIdFromUrl()
            this.Refresh()
        },
        Refresh: function () {
            var data = this.$data
            client.Request({
                type: 'get',
                url: '/demands/publishdemanddetail/' + this.$data.id,
                success: function (result) {
                    data.demand = result
                    if (!data.demand.ImgUrl) {
                        data.demand.ImgUrl = '/Content/image/default/demand.jpg'
                    }
                    data.SolveList = result.SolveList
                    data.SolveModel = result.SolveModel
                    //if (result.BusinessCategoryList) {
                    //    for (var i = 0; i < result.BusinessCategoryList.length; i++) {
                    //        data.category += result.BusinessCategoryList[i].Name
                    //        if (i != result.BusinessCategoryList.length - 1) { data.category += '/' }
                    //    }
                    //}

                    if(data.demand.BusinessNewCategory!=null){
                        if(data.demand.BusinessNewCategory.BusinessClassLevel1!=null){
                            data.category +=data.demand.BusinessNewCategory.BusinessClassLevelName1;
                        }
                        if(data.demand.BusinessNewCategory.BusinessClassLevel2!=null&& data.demand.BusinessNewCategory.BusinessClassLevel2 && data.demand.BusinessNewCategory.BusinessClassLevel2 != 'null'){
                            data.category +='/'+data.demand.BusinessNewCategory.BusinessClassLevelName2;
                        }
                        if(data.demand.BusinessNewCategory.BusinessClassLevel3!=null && data.demand.BusinessNewCategory.BusinessClassLevel3 && data.demand.BusinessNewCategory.BusinessClassLevel3 != 'null'){
                            data.category +='/'+data.demand.BusinessNewCategory.BusinessClassLevelName3;
                        }
                    }

                    if (!data.demand.ImgUrl) {
                        data.demand.ImgUrl = '/Content/image/default/demand.jpg'
                    }
                    if (result.RequirementTypeView.length > 0) {
                        $.each(result.RequirementTypeView, function (i, item) {
                            if (item != '其他') { data.RequirementTypeView += item + '|' }
                        })
                        data.RequirementTypeView = data.RequirementTypeView.substring(0, data.RequirementTypeView.length - 1)
                    }
                    if (result.SolutionView.length > 0) {
                        $.each(result.SolutionView, function (i, item) {
                            if (item != '其他') { data.SolutionView += item + '|' }
                        })
                        data.SolutionView = data.SolutionView.substring(0, data.SolutionView.length - 1)
                    }
                }
            })
        },
        show: function () {
            $('#mask').css({
                display: 'block'
                // height: $("html").height()
            })
            var $Popup = $('.popup')
            $Popup.css({
                // left: ($('body').width() - $Popup.width()) / 2 + 'px',
                // top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
                display: 'block'
            })
        },
        ExpertDetail: function (expertid) {
            window.location.href = '/expert/detail/' + expertid
        }
    }
})
function GetIdFromUrl() {
    var url = window.location.href
    var index = url.indexOf('?')
    if (index != -1) {
        url = url.substring(0, index)
    }
    var arr = url.split('/')
    var id = arr[arr.length - 1]
    return id
}
Vue.filter('formatDate', function (value) {
    if (value != null && value != '') {
        return value.substring(0, 10)
    }
})
vm.Init()
$('.disappear').click(function () {
    $('#mask,.popup').css('display', 'none')
})
$('.need_title li').click(function () {
    $(this).addClass('text_color').siblings().removeClass('text_color')
    $('.mui-content .needs_box').css('display', 'none').eq($(this).index()).css('display', 'block')
})
