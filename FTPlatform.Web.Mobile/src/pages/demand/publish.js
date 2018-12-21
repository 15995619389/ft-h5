import imageUploader from '../../components/image-uploader/image-uploader.vue'
import Vue from 'vue'
import * as client from '../../modules/ApiClient'
import categoryPicker from '../../components/category-picker/category-picker.vue'
import * as UrlService from '../../modules/UrlService'
import { Toast,Indicator } from 'mint-ui'

$(function () {
    $('.name_title input,.needs_bg textarea')
        .bind('click', function () {
            $('header').css('position', 'absolute')
        })
        .bind('blur', function () {
            $('header').css('position', 'fixed')
        })
})

new Vue({
    components: {
        imageUploader,
        categoryPicker
    },
    el: '#container',
    created: function () {
        // 用于显示图片
        var darr = $('#ApiUrl')
            .val()
            .split('/')
        this.$data.domain = darr.slice(0, darr.length - 1).join('/')

        var self = this
        if (!client.GetCurrentUser()) {
            window.location.href = '/passport/login'
            return
        }
        client.Request({
            type: 'get',
            url: '/user/complete',
            async: false,
            success: function (res) {
                if (res.err_code == '401') {
                    window.location.href = '/passport/login'
                    return
                }
                if (res.data == 0) {
                    self.$data.isPromptVisible = true
                }
            }
        })
    },
    mounted: function () {
        var self = this
        var id = UrlService.GetIdFromUrl()
        if (id) {
            client.Request({
                url: '/demands/v2/detail/' + id,
                type: 'get',
                data: {},
                success: function (res) {
                    if (res.Content) {
                        self.$data.demand = res.Content
                        self.ConvertMultiOptionsToArray()
                        self.$data.DemandDescription = client.ConvertHtmlToText(
                            self.$data.demand.Description
                        )
                    }
                },
                complete: function () {
                    self.InitComponents()
                }
            })
        } else {
            self.InitComponents()
        }
    },
    data: {
        demand: {
            Title: null,
            RequirementType: [],
            Solution: [],
            InputBudget: null,
            ExpectedFinishTime: null,
            PublishStatus: 1,
            DemandImg: [],
            BusinessClassLevel1: null,
            BusinessClassLevel2: null,
            BusinessClassLevel3: null,
            BusinessNewCategory: {BusinessClassLevel1:null,BusinessClassLevel2:null,BusinessClassLevel3:null}
        },
        domain: '', // 用于显示图片
        category: '', // 用于界面显示已经选择的行业标签
        DemandDescription: '',
        isPromptVisible: false
    },
    methods: {
        InitComponents: function () {
            var self = this
            self.$refs.uploader.Init({
                CallBack: function (data) {
                    self.$data.demand.DemandImg.push({ ImgPath: data })
                },
                Action: '/demands/image/upload'
            })
            self.$refs.catepicker.Init({
                CallBack: function (arr) {
                    self.UpdateCategory(arr)
                },
                Auto: true,
                HasBottom: false,
                Category:
                self.$data.demand.BusinessNewCategory.BusinessClassLevel1 +
                '-' +
                self.$data.demand.BusinessNewCategory.BusinessClassLevel2 +
                '-' +
                self.$data.demand.BusinessNewCategory.BusinessClassLevel3
            })
            var chosen = self.$refs.catepicker.GetChosen()
            self.UpdateCategory(chosen)
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
        UpdateCategory: function (arr) {
            var self = this
            self.$data.category = ''
            var BusinessNewCategory = {
                Type: 3,
                TypeNum: 1,
                BusinessClassLevel1: null,
                BusinessClassLevelName1: null,
                BusinessClassLevel2: null,
                BusinessClassLevelName2: null,
                BusinessClassLevel3: null,
                BusinessClassLevelName3: null
            }

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].Id) {
                    BusinessNewCategory['BusinessClassLevel' + arr[i].Level] = arr[i].Id;
                    BusinessNewCategory['BusinessClassLevelName' + arr[i].Level] = arr[i].Name;
                    //if (i == 0) {
                    //    self.$data.demand.BusinessClassName = arr[i].Name
                    //}
                    //self.$data.demand['BusinessClassLevel' + (i + 1)] = arr[i].Id

                    if (self.$data.category != '') {
                        self.$data.category += '>'
                    }
                    self.$data.category += arr[i].Name
                }
            }
            self.$data.demand.BusinessNewCategory = BusinessNewCategory;
        },
        UploadImage: function () {
            if (this.$data.demand.DemandImg.length > 4) {
                Toast({ message: '最多上传5张！', duration: 1000 })
            } else {
                this.$refs.uploader.Show()
            }
        },
        PickCategory: function () {
            this.$refs.catepicker.Show()
        },
        RemoveImage: function (index) {
            this.$data.demand.DemandImg.splice(index, 1)
        },
        Validate: function (msg) {
            var model = this.$data.demand
            model.Title = $.trim(model.Title)
            if (!model.Title || msg == 'Title') {
                Toast({ message: '标题不能为空', duration: 1000 })
                return false
            }
            if (model.Title.length > 200) {
                Toast({ message: '标题超出字数限制！', duration: 1000 })
                return false
            }
            if (!model.RequirementType || !model.RequirementType.length) {
                Toast({ message: '请选择需求类型！', duration: 1000 })
                return false
            }
            if (
                model.RequirementType.indexOf('6') != -1 &&
                !model.RequirementTypeOther
            ) {
                Toast({ message: '请填写需求类型其他内容！', duration: 1000 })
                return false
            }
            if (!model.Solution || !model.Solution.length) {
                Toast({ message: '请选择需求解决方式！', duration: 1000 })
                return false
            }
            if (model.Solution.indexOf('6') != -1 && !model.SolutionOther) {
                Toast({ message: '请填写需求解决方式其他内容！', duration: 1000 })
                return false
            }
            if (!model.InputBudget) {
                Toast({ message: '请选择投入预算！', duration: 1000 })
                return false
            }
            if (!model.ExpectedFinishTime) {
                Toast({ message: '请选择期望完成时间！', duration: 1000 })
                return false
            }
            model.BackgroundCauses = $.trim(model.BackgroundCauses)
            if (!model.BackgroundCauses) {
                Toast({ message: '请输入需求背景及成因！', duration: 1000 })
                return false
            }
            if (model.BackgroundCauses.length > 1000) {
                Toast({ message: '需求背景及成因超出字数限制！', duration: 1000 })
                return false
            }
            if (!this.$data.DemandDescription) {
                Toast({ message: '请输入现状描述！', duration: 1000 })
                return false
            }
            if (this.$data.DemandDescription.length > 10000) {
                Toast({ message: '现状描述超出字数限制！', duration: 1000 })
                return false
            }
            model.ArgsDesc = $.trim(model.ArgsDesc)
            if (!model.ArgsDesc) {
                Toast({ message: '请输入当前参数！', duration: 1000 })
                return false
            }
            if (model.ArgsDesc.length > 2000) {
                Toast({ message: '当前参数超出字数限制！', duration: 1000 })
                return false
            }
            model.ExpectDesc = $.trim(model.ExpectDesc)
            if (!model.ExpectDesc) {
                Toast({ message: '请输入期望要求！', duration: 1000 })
                return false
            }
            if (model.ExpectDesc.length > 2000) {
                Toast({ message: '期望要求超出字数限制！', duration: 1000 })
                return false
            }
            model.AnticipateDesc = $.trim(model.AnticipateDesc)
            if (!model.AnticipateDesc) {
                Toast({ message: '请输入预期参数！', duration: 1000 })
                return false
            }
            if (model.AnticipateDesc.length > 1000) {
                Toast({ message: '预期参数超出字数限制！', duration: 1000 })
                return false
            }
            if (!model.BusinessNewCategory.BusinessClassLevel1 || !model.BusinessNewCategory.BusinessClassLevel2) {
                Toast({ message: '请选择需求标签！', duration: 1000 })
                return false
            }
            return true
        },
        Post: function (AuditingStatus) {
            var self = this
            var isSub=true;
            self.$data.demand.AuditingStatus = AuditingStatus

            if (!self.Validate()&&!isSub) {
                return false
            }

            isSub=false;
            Indicator.open('提交中,请稍等...');
            // 这里新建一个对象来POST，防止出错后多选变为字符串页面显示错误
            var data = {}
            $.extend(data, self.$data.demand)
            data.RequirementType = data.RequirementType.join(',')
            data.Solution = data.Solution.join(',')
            data.Description = client.ConvertTextToHtml(self.DemandDescription)

            client.Request({
                type: 'post',
                url: '/demands',
                data: data,
                success: function (result) {
                    if (result.err_code == '401') {
                        window.location.href =
                            '/passport/login?' +
                            'returnurl=' +
                            UrlService.GetEncodedUrl()
                        return
                    }
                    if ((result.err_code = '400' && result.err_msg == 'Info')) {
                        Toast({ message: '请先完善个人信息再发布需求！', duration: 1000 })
                        return
                    }
                    if (result.data) {
                        if (result.data.AuditingStatus == 1) {
                            window.location.href = '/demand/submited'
                            return
                        }
                        if (result.data.AuditingStatus == 99) {
                            window.location.href = '/demand/saved'
                            return
                        }
                    }
                    Toast({ message: '提交失败！', duration: 1000 })
                },
                complete: function (result) {
                    isSub=true;
                    Indicator.close();
                },
                error: function (req, text, err) { }
            })
        }
    }
})
