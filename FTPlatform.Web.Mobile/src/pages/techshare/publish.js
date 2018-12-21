import imageUploader from '../../components/image-uploader/image-uploader.vue';
import Vue from 'vue';
import * as client from '../../modules/ApiClient';
import catePicker from '../../components/category-picker/category-picker.vue';
import * as UrlService from '../../modules/UrlService';
import { Toast, DatetimePicker, Indicator } from 'mint-ui';

/* ---点击input、textarea时header状态----------- */
$(function () {
    $('.PatentInformation input,.Research_bg textarea,.need_form textarea,.name_title input').bind('click', function () {
        $('header').css('position', 'absolute');
    }).bind('blur', function () {
        $('header').css('position', 'fixed');
    });
    $('#choicetab').on('click', function () {
        $('html,body').addClass('html-fiexd');
    });
    $('.label-btn .mui-btn-block').on('click', function () {
        $('html,body').removeClass('html-fiexd');
    });
});

Vue.component(DatetimePicker.name, DatetimePicker);

var vm = new Vue({
    components: {
        imageUploader,
        categoryPicker: catePicker
    },
    el: '#container',
    data: {
        TechShare: {
            ImgUrl: '',
            TechSupplier: null,
            DevelPhase: null,
            TechTradWay: [],
            TechPatent: [],
            TechAttachAll: [],
            BusinessClassLevel1: null,
            BusinessClassLevel2: null,
            BusinessClassLevel3: null,
            BusinessNewCategory: {BusinessClassLevel1:null,BusinessClassLevel2:null,BusinessClassLevel3:null}
        },
        DevelopBackdrop: '',
        ApplicaRange: '',
        ProductEquip: '',
        TechTheory: '',
        EconomyAnalyze: '',
        TechPatentModel: { PatentNum: '', Country: '', PatentType: '', ApplyTime: null, AccreditTime: null },
        domain: '',
        IsSub: true,
        Category: ''
    },
    computed: {
        StartDate: function () {
            return new Date('1950-01-01');
        },
        EndDate: function () {
            return new Date();
        }
    },
    created: function () {
        var darr = $('#ApiUrl').val().split('/');
        this.$data.domain = darr.slice(0, darr.length - 1).join('/');

        if (!client.GetCurrentUser()) {
            window.location.href = client.LoginReturn(location.href);
            return;
        }
        client.Request({
            type: 'get',
            url: '/user/complete',
            async: false,
            success: function (res) {
                if (res.err_code == '401') {
                    window.location.href = client.LoginReturn(location.href);
                    return;
                }
                if (res.data == 0) {
                    $('.prompt').show();
                }
            }
        })
    },
    mounted: function () {
        var self = this;
        var id = UrlService.GetIdFromUrl();
        if (id) {
            client.Request({
                url: '/tech/v2/recommenddetail/' + id,
                type: 'GET',
                success: function (res) {
                    self.$data.TechShare = res.Data;
                    var techShareData = self.$data.TechShare;

                    self.$data.DevelopBackdrop = client.ConvertHtmlToText(techShareData.DevelopBackdrop);
                    self.$data.ApplicaRange = client.ConvertHtmlToText(techShareData.ApplicaRange);
                    self.$data.ProductEquip = client.ConvertHtmlToText(techShareData.ProductEquip);
                    self.$data.TechTheory = client.ConvertHtmlToText(techShareData.TechTheory);
                    self.$data.EconomyAnalyze = client.ConvertHtmlToText(techShareData.EconomyAnalyze);

                    if (self.$data.TechShare.TechTradWay) {
                        self.$data.TechShare.TechTradWay = self.$data.TechShare.TechTradWay.split(',');
                    } else {
                        self.$data.TechShare.TechTradWay = [];
                    }
                    if (self.$data.TechShare.TechPatent) {
                        self.$data.TechPatentModel = self.$data.TechShare.TechPatent[0];
                        self.$data.TechPatentModel.ApplyTime = self.formatDate(self.$data.TechPatentModel.ApplyTime);
                        self.$data.TechPatentModel.AccreditTime = self.formatDate(self.$data.TechPatentModel.AccreditTime);
                    }
                },
                complete: function () {
                    self.InitComponents();
                }
            });
        } else {
            self.InitComponents();
        }
    },
    methods: {
        InitComponents: function () {
            var self = this;
            self.$refs.uploader.Init({
                CallBack: function (data) {
                    self.$data.TechShare.ImgUrl = data;
                },
                Action: '/tech/uploadimage'
            });
            self.$refs.catepicker.Init({
                CallBack: function (arr) {
                    self.UpdateCategory(arr);
                },
                Auto: true,
                HasBottom: false,
                Category: self.$data.TechShare.BusinessNewCategory.BusinessClassLevel1 +
                    '-' +
                    self.$data.TechShare.BusinessNewCategory.BusinessClassLevel2 +
                    '-' +
                    self.$data.TechShare.BusinessNewCategory.BusinessClassLevel3
            })
            var chosen = self.$refs.catepicker.GetChosen();
            self.UpdateCategory(chosen);
        },
        UpdateCategory: function (arr) {
            var self = this;
            self.$data.Category = '';
            var BusinessNewCategory = {
                Type: 4,
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
                    // self.$data.TechShare["BusinessClassLevel" + (i + 1)] = arr[i].Id;
                    if (self.$data.Category != '') {
                        self.$data.Category += '>'
                    }
                    self.$data.Category += arr[i].Name;
                }
            }
            self.$data.TechShare.BusinessNewCategory = BusinessNewCategory;
        },
        formatDate: function (value, len) {
            if (value != null && value != '') {
                if (len) {
                    return value.substring(0, len);
                } else {
                    return value.substring(0, 10);
                }
            }
        },
        openPicker1: function () {
            this.$refs.dateTimepicker1.open();
        },
        openPicker2: function () {
            this.$refs.dateTimepicker2.open();
        },
        GetApplyTime: function (data) {
            this.$data.TechPatentModel.ApplyTime = new Date(data).toLocaleDateString();
        },
        GetAccreditTime: function (data) {
            this.$data.TechPatentModel.AccreditTime = new Date(data).toLocaleDateString();
        },
        Post: function (status) {
            var self = this
            if (!client.GetCurrentUser()) {
                window.location.href = client.LoginReturn(location.href);
                return;
            }
            self.$data.TechShare.Status = status;
            if (self.validate() && this.$data.IsSub) {
                var data = self.TechData();
                self.$data.IsSub = false;
                Indicator.open('提交中,请稍等...')
                client.Request({
                    type: 'post',
                    url: '/tech/techsubmit',
                    data: data,
                    success: function (result) {
                        if (result.StausCode == '200') {
                            $('#techContent').removeClass('l-scrollable')
                            $('#mask').css({
                                display: 'block',
                                height: '100%'
                            });
                            if (status == 1) {
                                $('.popup_consult').css({ 'display': 'block' });
                            }
                            if (status == -99) {
                                $('.popup').css({ 'display': 'block' });
                            }
                        } else {
                            Toast({ message: result.Message, duration: 1000 });
                        }
                    },
                    complete: function (result) {
                        self.$data.IsSub = true;
                        Indicator.close();
                    }
                })
            }
        },
        SkipUrl: function () {
            window.location.href = '/techshare/releasetechnology';
        },
        PickCategory: function () {
            this.$refs.catepicker.Show();
        },
        GetApplyTime: function (data) {
            this.$data.TechPatentModel.ApplyTime = new Date(data).toLocaleDateString();
        },
        GetAccreditTime: function (data) {
            this.$data.TechPatentModel.AccreditTime = new Date(data).toLocaleDateString();
        },
        TechData: function () {
            var self = this;
            var data = {};
            $.extend(data, self.$data.TechShare);

            data.DevelopBackdrop = client.ConvertTextToHtml(self.$data.DevelopBackdrop);
            data.ApplicaRange = client.ConvertTextToHtml(self.$data.ApplicaRange);
            data.ProductEquip = client.ConvertTextToHtml(self.$data.ProductEquip);
            data.TechTheory = client.ConvertTextToHtml(self.$data.TechTheory);
            data.EconomyAnalyze = client.ConvertTextToHtml(self.$data.EconomyAnalyze);
            data.TechTradWay = data.TechTradWay.join(',');

            if (self.$data.TechPatentModel.PatentNum || self.$data.TechPatentModel.Country || self.$data.TechPatentModel.PatentType ||
                self.$data.TechPatentModel.ApplyTime || self.$data.TechPatentModel.AccreditTime) 
            {
                data.TechPatent = [];
                if (self.$data.TechPatentModel && self.$data.TechPatentModel.Id == 0) {
                    data.TechPatent.push(self.$data.TechPatentModel)
                } else {
                    var techPatent = {};
                    techPatent.PatentNum = self.$data.TechPatentModel.PatentNum;
                    techPatent.Country = self.$data.TechPatentModel.Country;
                    techPatent.PatentType = self.$data.TechPatentModel.PatentType;
                    techPatent.ApplyTime = self.$data.TechPatentModel.ApplyTime;
                    techPatent.AccreditTime = self.$data.TechPatentModel.AccreditTime;
                    data.TechPatent.push(techPatent);
                }
            }else{
                data.TechPatent = [];
            }
            return data
        },
        validate: function () {
            var model = this.$data.TechShare;
            var techpatent = this.$data.TechPatentModel;
            var isPas = true;
            if (!model.Title) {
                isPas = false;
                Toast({ message: '技术名称不能为空', duration: 1000 });
            } else if (model.Title.length > 30) {
                isPas = false;
                Toast({ message: '技术名称不能大于30个字', duration: 1000 });
            } else if (!model.ImgUrl) {
                isPas = false;
                Toast({ message: '请上传一张图片', duration: 1000 });
            } else if (!model.TechSupplier) {
                isPas = false;
                Toast({ message: '请选择技术提供者身份', duration: 1000 });
            } else if (!model.DevelPhase) {
                isPas = false;
                Toast({ message: '请选择技术研发阶段', duration: 1000 });
            } else if (!model.TechTradWay || !model.TechTradWay.length) {
                isPas = false;
                Toast({ message: '请选择交易方式', duration: 1000 });
            } else if (model.TechTradOther && model.TechTradOther.length > 200) {
                isPas = false;
                Toast({ message: '具体交易方式不能大于200个字', duration: 1000 });
            }else if(!model.BusinessNewCategory.BusinessClassLevel1||!model.BusinessNewCategory.BusinessClassLevel2){
                isPas = false;
                Toast({ message: '请选择标签', duration: 1000 });
            }else if (!this.$data.DevelopBackdrop) {
                isPas = false;
                Toast({ message: '研发背景不能为空', duration: 1000 });
            } else if (!this.$data.ApplicaRange) {
                isPas = false;
                Toast({ message: '应用范围不能为空', duration: 1000 });
            } else if (!this.$data.TechTheory) {
                isPas = false;
                Toast({ message: '技术路线不能为空', duration: 1000 });
            } else if (!model.Feature) {
                isPas = false;
                Toast({ message: '技术特色不能为空', duration: 1000 });
            } else if (techpatent.PatentNum && techpatent.PatentNum.length > 50) {
                isPas = false;
                Toast({ message: '专利号不能大于50个字', duration: 1000 });
            } else if (techpatent.Country && techpatent.Country.length > 50) {
                isPas = false;
                Toast({ message: '国家不能大于50个字', duration: 1000 });
            } else if (techpatent.PatentType && techpatent.PatentType.length > 50) {
                isPas = false;
                Toast({ message: '专利类型不能大于50个字', duration: 1000 });
            } else if (!this.$data.EconomyAnalyze) {
                isPas = false;
                Toast({ message: '经济效益分析不能为空', duration: 1000 });
            }

            return isPas;
        },
        UploadImage: function () {
            if (this.$data.TechShare.ImgUrl != '') {
                Toast({ message: '只能上传一张首图', duration: 1000 });
            } else {
                this.$refs.uploader.Show();
            }
        },
        RemoveImage: function () {
            this.$data.TechShare.ImgUrl = '';
        },
        RemoveFile: function (index) {
            this.$data.TechShare.TechAttachAll.splice(index, 1);
        }
    }
})

$(document).on("change","input[type='file']",function(event){
    var fileObject= $(this)[0]

    fileUpload(fileObject.id)

    event.stopPropagation()
});

var fileUpload=function(element){
    if(!vm.IsSub){ 
        return
    }
    var formData = new FormData();
    formData.append('moduleName', 'TechShare');
    var $fileAttach = $('#'+element);
    
    if ($fileAttach.val() != null && $fileAttach.val() != '') {
        var files = $fileAttach.get(0).files;
        for (var i = 0; i < files.length; i++) {
            var lastIndex = files[i].name.lastIndexOf('\.');
            var fileType = files[i].name.substring(lastIndex + 1, files[i].name.length);
            if (fileType != null && fileType != '' && fileType != undefined) {
                fileType=fileType.toLowerCase()
                if (fileType != 'doc' && fileType != 'docx' && fileType != 'pdf' && fileType != 'xls' && fileType != 'xlsx') {
                    Toast({ message: '上传文件只支持doc,docx,pdf,xls,xlsx', duration: 2000 });
                    replaceFile(element)
                    return;
                }
            }else{
                Toast({ message: '文件格式有问题', duration: 2000 });
                replaceFile(element)       
                return;
            }

            var maxsize = 2*1024*1024;//2M
            if (files[i].size > maxsize) {
                Toast({ message: '上传文件不能大于2M', duration: 2000 });
                replaceFile(element)
                return;
            }
            formData.append('File' + i, files[i]);
        }
    }
    vm.IsSub=false
    client.Request({
        type: 'post',
        url: '/tech/uploadfile',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        success: function (result, status) {
            if (result.StausCode == '200') {
                $(result.DataSource).each(function (i, o) {
                    vm.TechShare.TechAttachAll.push(o);
                })
            } else {
                Toast({ message: result.Message + '上传失败', duration: 1000 });
            }
        },
        error: function (xhr, status, err) {
            Toast({ message: '上传失败', duration: 1000 });
        },
        complete: function (result) {
            replaceFile(element)
            vm.IsSub = true;
        }
    })

}

var replaceFile=function(element){
    $("#"+element).replaceWith('<input type="file" class="file_box" id="'+element+'" size="28" >'); 
}