import Vue from "vue";
import * as client from "../../modules/ApiClient";
import * as StorageService from "../../modules/StorageService";
import * as UrlService from "../../modules/UrlService";
import scroller from "vue-scroller";
import FilterService from "../../modules/FilterService.js";
import catePicker from "../../components/category-picker/category-picker.vue";

Vue.filter('formatDate', function (value) {
    if (value != null && value != "") {
        return value.substring(0, 10);
    }
});

var vm = new Vue({
    el: ".searchMain",
    components: {
        scroller: scroller.Scroller,
        categoryPicker: catePicker
    },
    data: {
        demands: [
            [],
            [],
            [],
            [],
            [],
            []
        ],
        tests: [
            []
        ],
        types: {},
        total: 0,
        totalfortype: 0,
        selecttypemodel: {
            Name: '',
            Count: 0,
            nType: 0,
        },
        searchmodel: {
            key: '',
            dt: -1,
            pageIndex: 0,
            pageSize: 10,
        },
        demandmodel: {
            amountInterval: [{
                    des: '<1万',
                    min: 0,
                    max: 10000,
                    val: 1
                },
                {
                    des: '1~10万',
                    min: 10000,
                    max: 100000,
                    val: 2
                },
                {
                    des: '10~50万',
                    min: 10000,
                    max: 500000,
                    val: 3
                },
                {
                    des: '50~200万',
                    min: 500000,
                    max: 2000000,
                    val: 4
                },
                {
                    des: '>200万',
                    min: 2000000,
                    max: -1,
                    val: 5
                },
            ],
            Item_AmountSpan: {},
            AmountSpan: {},
            amountswitch: false,
            publishData: [{
                    des: '一周之内',
                    days: 7
                },
                {
                    des: '两周之内',
                    days: 14
                },
                {
                    des: '一月之内',
                    days: 30
                }
            ],
            Item_PublishSpan: {},
            PublishSpan: {},
            publishswitch: false,
        },
        expertmodel: {
            expertCategory: [{
                    des: '明星专家',
                    val: 1
                },
                {
                    des: '普通专家',
                    val: 0
                }
            ],
            eCate: {},
            Item_eCate: {},
            expertType: [{
                    des: '个人专家',
                    val: 0
                },
                {
                    des: '科研机构',
                    val: 1
                },
            ],
            eType: {},
            Item_eType: {},
            BusCates: {
                Lv1: {},
                Lv2: {},
                Lv3: {},
            }
        },
        techsharemodel: {
            cooperationMethod: [{
                    des: '出售',
                    val: 0
                },
                {
                    des: '授权许可',
                    val: 1
                },
                {
                    des: '技术入股',
                    val: 2
                },
                {
                    des: '研发合同',
                    val: 3
                },
                {
                    des: '风险投资',
                    val: 4
                },
            ],
            tMethod: {},
            Item_tMethod: {},
            ResearchStage: [{
                    des: '产业化',
                    val: 0
                },
                {
                    des: '已有样品',
                    val: 1
                },
                {
                    des: '中试',
                    val: 2
                },
                {
                    des: '小试',
                    val: 3
                },
                {
                    des: '研发',
                    val: 4
                },
            ],
            tStage: {},
            Item_tStage: {},
            BusCates: {
                Lv1: {},
                Lv2: {},
                Lv3: {},
            }
        },
        patentmodel:{
            //交易方式
            wayTrade:[{
                    des:'转让',
                    val:1
                },
                {
                    des:"普通许可",
                    val:2
                },
                {
                    des:"独占许可",
                    val:3
                },
                {
                    des:"排他许可",
                    val:4
                }
            ],
            patent_way:{},
            p_way:{},
            //专利状态
            patentStatus:[{
                    des:"申请中",
                    val:1
                },
                {
                    des:"实审中", //无用
                    val:2
                },
                {
                    des:"授权",
                    val:3
                },
                {
                    des:"证书",
                    val:4
                },
            ],
            patent_status:{},
            p_status:{},
            //专利类型
            patentType:[{
                    des:"外观设计专利",
                    val:1
                },
                {
                    des:"实用新型专利",
                    val:2
                },
                {
                    des:"发明专利",
                    val:3
                },
            ],
            patent_type:{},
            p_type:{},
        },
        loading: false,
        refreshText: '下拉刷新1',
        noDataText: '', //(this.totalfortype == 0 && this.loading == false ? '': '没有更多数据')
        snapping: false,
    },
    created: function () {
        var stext = UrlService.GetParamUrl("skey");
        var stype = UrlService.GetParamUrl("stype");

        if (stype && stype != "")
            this.searchmodel.dt = Number(stype);

        if (stext && stext != "")
            this.searchmodel.key = stext;
    },
    methods: {
        RequestData: function (fn) {
            var self = this;
            var data = this.$data;

            data.searchmodel.sdemand = {
                amount: data.demandmodel.AmountSpan,
                publish: data.demandmodel.PublishSpan,
            };

            if (data.expertmodel) {
                data.searchmodel.sexpert = {
                    ecate: data.expertmodel.eCate,
                    etype: data.expertmodel.eType,
                    buscates: data.expertmodel.BusCates
                }
            }

            if (data.techsharemodel) {
                data.searchmodel.stech = {
                    tmethod: data.techsharemodel.tMethod,
                    tstage: data.techsharemodel.tStage,
                    buscates: data.techsharemodel.BusCates,
                }
            }
            if(data.patentmodel){
                data.searchmodel.spatent = {
                    patent_way:data.patentmodel.patent_way,
                    patent_status:data.patentmodel.patent_status,
                    patent_type:data.patentmodel.patent_type,                   
                }
                
            }

            client.Request({
                url: '/search/',
                type: 'post',
                data: data.searchmodel,
                beforeSend: function () {
                    self.loading = true;
                },
                success: function (result) {
                    if (fn && typeof fn == "function") {
                        fn(result);
                    } else {
                        data.demands[data.searchmodel.dt].length = 0;
                        for (var i = 0; i < result.data.length; i++) {
                            data.demands[data.searchmodel.dt].push(result.data[i]);
                        }
                    }
                },
                error: function (request, status, settings) {
                    self.AjaxError(request, status, settings, function () {
                        client.Request({
                            url: '/search/',
                            type: 'post',
                            data: data.searchmodel,
                            beforeSend: function () {
                                self.loading = true;
                            },
                            success: function (result) {
                                if (fn && typeof fn == "function") {
                                    fn(result);
                                } else {
                                    data.demands[data.searchmodel.dt].length = 0;
                                    for (var i = 0; i < result.data.length; i++) {
                                        data.demands[data.searchmodel.dt].push(result.data[i]);
                                    }
                                }
                            },
                            complete: function (result) {
                                if (result && result.responseJSON) {
                                    data.types = result.responseJSON.types;
                                    data.total = result.responseJSON.total;

                                    data.searchmodel.dt = result.responseJSON.mdt;
                                    self.SelectType();
                                    self.loading = false;
                                }
                            }
                        });
                    });
                },
                complete: function (result) {
                    self.loading = false;
                    if (result && result.responseJSON) {
                        data.types = result.responseJSON.types;
                        data.total = result.responseJSON.total;

                        data.searchmodel.dt = result.responseJSON.mdt;
                        self.SelectType();

                    }
                }
            });
        },
        patentStatus:function(number){
            var self =this;
            if( number == 1){
                number = "申请中";     
            }else if(number == 2){
                
            }else if(number == 3){
                number = "授权";               
            }else{
                number = "证书";                
            } 
            return number;
        },
        patentmoney:function(num){
            var money;
            if(num <= 0){
                money = "面议";
            }else{
                money = "￥"+num;
                
            }
            return money;
        },
        converttmode:function(mode){
            var result = "";
            var searchmodel = this.$data.searchmodel;
            if(searchmodel && searchmodel.spatent && searchmodel.spatent.patent_way && searchmodel.spatent.patent_way.val > 0){
                switch (searchmodel.spatent.patent_way.val) {
                    case 1:
                        result = "转让";
                        break;
                    case 2:
                        result = "普通许可";
                        break;
                    case 3:
                        result = "独占许可";
                        break;
                    case 4:
                        result = "排他许可";
                        break;
                    default:
        
                }  
            }
            else
            {
                if(!mode)
                    return result;

                var Arr1 = mode.substring(0,1);
                Arr1 = parseInt(Arr1);
                switch (Arr1) {
                    case 1:
                        result = "转让";
                        break;
                    case 2:
                        result = "普通许可";
                        break;
                    case 3:
                        result = "独占许可";
                        break;
                    case 4:
                        result = "排他许可";
                        break;
                    default:
        
                }  

            }

            return result;
        },
        InitData: function (para) {
            var self = this;
            var data = self.$data;
            $.extend(data.searchmodel, para);

            data.searchmodel.sdemand = {
                amount: data.demandmodel.AmountSpan,
                publish: data.demandmodel.PublishSpan,
            };
            client.Request({
                url: '/search/',
                type: 'post',
                data: data.searchmodel,
                beforeSend: function () {
                    self.loading = true;
                },
                success: function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        vm.$data.demands[result.mdt].push(result.data[i]);
                    }
                    vm.$data.types = result.types;
                    vm.$data.total = result.total;
                    vm.$data.searchmodel.dt = result.mdt;

                    self.SelectType();
                    if (!result || !result.data || result.data.length == 0) {
                        self.$refs.child1.noDataText = "";
                    }
                },
                error: function (request, status, settings) {
                    self.AjaxError(request, status, settings, function () {
                        client.Request({
                            url: '/search/',
                            type: 'post',
                            data: data.searchmodel,
                            beforeSend: function () {
                                self.loading = true;
                            },
                            success: function (result) {
                                for (var i = 0; i < result.data.length; i++) {
                                    data.demands[result.mdt].push(result.data[i]);
                                }
                                data.types = result.types;
                                data.total = result.total;
                                data.searchmodel.dt = result.mdt;

                                self.SelectType();
                                if (!result || !result.data || result.data.length == 0) {
                                    self.$refs.child1.noDataText = "";
                                }
                            },
                            complete: function () {
                                self.loading = false;
                            }
                        });
                    });
                },
                complete: function () {
                    self.loading = false;
                }
            });
        },
        Reresh: function (fn) {
            var self = this;
            setTimeout(function () {

                self.$data.searchmodel.pageIndex = 1;
                self.RequestData(function (result) {
                    var data = self.$data;
                    data.demands[result.mdt].splice(0, data.demands[result.mdt].length);
                    for (var i = 0; i < result.data.length; i++) {
                        data.demands[result.mdt].push(result.data[i]);
                    }

                    if (fn && typeof fn == "function")
                        fn(result);
                });
            }, 500);
        },
        Append: function (fn) {
            var self = this;
            setTimeout(function () {
                self.$data.searchmodel.pageIndex++;
                self.RequestData(function (result) {
                    var data = self.$data;
                    for (var i = 0; i < result.data.length; i++) {
                        data.demands[result.mdt].push(result.data[i]);
                    }

                    if (fn && typeof fn == "function")
                        fn(result);
                })
            }, 500);
        },
        eReresh: function (bone) {
            if (self.loading)
                return;
            this.Reresh(function (result) {
                var ismore = true;
                if (result.data && result.data.length > 0)
                    ismore = false;

                bone(ismore);
            });
        },
        eAppend: function (bone) {
            if (self.loading)
                return;
            this.Append(function (result) {
                var ismore = true;
                if (result.data && result.data.length > 0)
                    ismore = false;

                bone(ismore);
            });
        },
        SelectType: function (t) {
            var data = this.$data;
            if (!t) {
                data.totalfortype = data.demands[data.searchmodel.dt] ? data.demands[data.searchmodel.dt].length : 0;
                if (data.types && data.types.length > 0) {
                    for (var i = 0; i < data.types.length; i++) {
                        if (data.types[i].Value == data.searchmodel.dt) {
                            data.selecttypemodel.Name = data.types[i].Des;
                            data.selecttypemodel.Count = data.types[i].nCount;
                            data.selecttypemodel.nType = data.types[i].Value;
                        }
                    }
                }
            } else {
                data.selecttypemodel.Name = t.Des;
                data.selecttypemodel.Count = t.nCount;
                data.selecttypemodel.nType = t.Value;
            }
        },
        ToggleType: function () {
            var self = this;
            var data = this.$data;

            $(".box").slideToggle(300);
            $(".search_label").slideToggle(300);

            var ds = data.demands[data.selecttypemodel.nType];
            data.totalfortype = 0;
            data.loading = true;
            if (ds && ds.length > 0) {}

            data.searchmodel.dt = data.selecttypemodel.nType;
            data.searchmodel.pageIndex = 1;
            self.search();
        },
        SelectAmountSpan: function (amount) {
            var data = this.$data;
            data.demandmodel.Item_AmountSpan = amount;
        },
        SelectPublishSpan: function (publish) {
            var data = this.$data;
            data.demandmodel.Item_PublishSpan = publish;
        },
        DemandResetAmount: function () {
            var data = this.$data;
            data.demandmodel.Item_AmountSpan = {};
        },
        DemandResetPublish: function () {
            var data = this.$data;
            data.demandmodel.Item_PublishSpan = {};
        },
        Demanddetermine: function () {
            var data = this.$data;

            data.demandmodel.AmountSpan = data.demandmodel.Item_AmountSpan;
            data.demandmodel.PublishSpan = data.demandmodel.Item_PublishSpan;

            this.search();
        },
        Reset: function (t, d) {
            var data = this.$data;
            if (t == 1) {
                if (d == 1)
                    data.expertmodel.Item_eCate = {};
                else
                    data.expertmodel.Item_eType = {};                   
            } else if (t == 2) {
                if (d == 1)
                    data.techsharemodel.Item_tMethod = {};
                else
                    data.techsharemodel.Item_tStage = {};
            }else if(t == 3){
                if(d == 1){
                    data.patentmodel.p_way = {};
                }else if(d == 2){
                    data.patentmodel.p_status = {};
                }else{
                    data.patentmodel.p_type = {}
                }
            }
        },
        determine: function (t, d) {
            var data = this.$data;
            if (t == 1) {
                data.expertmodel.eCate = data.expertmodel.Item_eCate;
                data.expertmodel.eType = data.expertmodel.Item_eType;
            } else if (t == 2) {
                if (d == 1)
                    data.techsharemodel.tMethod = data.techsharemodel.Item_tMethod;
                else
                    data.techsharemodel.tStage = data.techsharemodel.Item_tStage;
            }else{
                if(d == 1){
                    data.patentmodel.patent_way = data.patentmodel.p_way;
                }else if(d == 2){
                    data.patentmodel.patent_status = data.patentmodel.p_status;
                }else{
                    data.patentmodel.patent_type = data.patentmodel.p_type;
                }
            }

            this.search();
        },
        SetExpertBus: function (bus) {
            var data = this.$data;

            if (data.searchmodel.dt == 1) {
                data.expertmodel.BusCates.Lv1 = bus.categoryLv1;
                data.expertmodel.BusCates.Lv2 = bus.categoryLv2;
                data.expertmodel.BusCates.Lv3 = bus.categoryLv3;
            } else if (data.searchmodel.dt == 2) {
                data.techsharemodel.BusCates.Lv1 = bus.categoryLv1;
                data.techsharemodel.BusCates.Lv2 = bus.categoryLv2;
                data.techsharemodel.BusCates.Lv3 = bus.categoryLv3;
            }

            if (bus.categoryLv1 && bus.categoryLv1.Id == "0") {
                data.expertmodel.BusCates.Lv1 = {};
                data.expertmodel.BusCates.Lv2 = {};
                data.expertmodel.BusCates.Lv3 = {};

                data.techsharemodel.BusCates.Lv1 = {};
                data.techsharemodel.BusCates.Lv2 = {};
                data.techsharemodel.BusCates.Lv3 = {};
            }

            this.search();
        },
        PickCategory: function () {
            this.$refs.catepicker.Show();
        },
        AjaxError: function (request, status, settings, fn) {
            if (request.status == 401) {

                var isretry = false;
                if (request.responseJSON.data && request.responseJSON.data.Retry)
                    isretry = request.responseJSON.data.Retry == "1" ? true : false;

                var authtoken = StorageService.Get("i_authtoken");
                var data = "grant_type=refresh_token&refresh_token=" + authtoken.refresh_token;
                $.ajax({
                    url: '/token/refresh',
                    type: "POST",
                    data: {
                        refreshtoken: authtoken.refresh_token
                    },
                    async: true,
                    dataType: 'json',
                    success: function (result) {
                        if (result && result.data && result.data.access_token) {
                            StorageService.Set("i_authtoken", result.data);
                        }

                        if (isretry && result.err_code == "0000") {
                            window.setTimeout(function () {
                                if (isretry) {
                                    if (typeof fn == "function") {
                                        fn();
                                    }
                                }
                            }, 500);
                        }

                    }
                });
            } else if (request.status == 403) {
                StorageService.Set("i_authtoken", "")
                location.reload();
            }
        },
        search: function () {
            var data = this.$data;
            var self = this;
            data.loading = true;
            data.searchmodel.dt = data.selecttypemodel.nType;
            data.searchmodel.pageIndex = 1;
            self.$refs.child1.scrollTo(0, 0);
            self.$refs.child1.triggerPullToRefresh();
        }
    },
    mounted: function () {
        var self = this;
        setTimeout(function () {
            self.$refs.catepicker.Init({
                CallBack: function (arr) {
                    $(".mask_box").fadeOut();
                    var param = {};
                    if (arr[0]) {
                        param.categoryLv1 = arr[0];
                    } else {
                        param.categoryLv1 = {};
                    }

                    if (arr[1]) {
                        param.categoryLv2 = arr[1];
                    } else {
                        param.categoryLv2 = {};
                    }

                    if (arr[2]) {
                        param.categoryLv3 = arr[2];
                    } else {
                        param.categoryLv3 = {};
                    }

                    vm.SetExpertBus(param);
                },
                Auto: true,
                HasBottom: false,
            });
        }, 500);
    }
});

if (vm.searchmodel.dt < 0) {
    vm.searchmodel.pageIndex = 1;
    vm.InitData();
}

//绑定选择下拉类别
$(document).off().on("click", ".search_bg", function () {
    $(".box").slideToggle(300);
    $(".search_label").slideToggle(300);

    $(".mask_box").hide();
    $(".needs_down").hide();
    $(".experts_down").hide();
    $(".cooperation").hide();
    $(".patent_down").hide();
});

//选择分类
$(document).on("click", ".categoriesPicker", function () {
    $(".mask_box").hide();
    $(".needs_down").hide();
    $(".experts_down").hide();
    $(".patent_down").hide();
    $(".cooperation").hide();
});

//绑定重置按钮
$(document).on("click", ".reset", function () {
    $(this).parent().siblings("div").find("span").removeClass("active");
});

//确定按钮 条件搜索
$(document).on("click", ".determine", function () {
    $(".mask_box").fadeOut();
    $(this).parent().parent().slideToggle(300);
});

//需求条件点击
$(document).on("click", ".need_title li", function (event) {
    $(this).css({
        "color": "#ff6525"
    }).siblings().css({
        "color": "#595757"
    });
    $(".needs_down").eq($(this).index()).siblings("div").slideUp(300);
    $(".needs_down").eq($(this).index()).slideToggle(300, function () {
        qiehuan();
    });
    $(".needs_nav span").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });

    event.stopPropagation();
});

var qiehuan = function () {
    var isshow = $(".needs_down:visible");
    if (isshow && isshow.length > 0)
        $(".mask_box").fadeIn();
    else
        $(".mask_box").fadeOut();
};

var expertqiehuan = function () {
    var isshow = $(".experts_down:visible");
    if (isshow && isshow.length > 0)
        $(".mask_box").fadeIn();
    else
        $(".mask_box").fadeOut();
};

var patentqiehuan = function(){
    var isshow = $(".patent_down:visible");
    if(isshow && isshow.length>0){
        $(".mask_box").fadeIn();
    }else{
        $(".mask_box").fadeOut();
    }
}
var techqiehuan = function () {
    var isshow = $(".cooperation:visible");
    if (isshow && isshow.length > 0)
        $(".mask_box").fadeIn();
    else
        $(".mask_box").fadeOut();
};

/*-----专家li------*/
$(document).on("click", ".experts_title li", function () {
    $(this).css({
        "color": "#ff6525"
    }).siblings().css({
        "color": "#595757"
    });

    if ($(this).index() == "0") {
        $(".experts_down").eq($(this).index()).siblings("div").slideUp(300);
        $(".experts_down").eq($(this).index()).slideToggle(300, function () {
            expertqiehuan();
        });
        $(".experts_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    } else if ($(this).index() == "1") {
        $(".experts_down").eq($(this).index()).siblings("div").slideUp(300);
        $(".experts_down").eq($(this).index()).slideToggle(300, function () {
            expertqiehuan();
        });
        $(".experts_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    } else if ($(this).index() == "2") {}

    event.stopPropagation();
});

//技术推荐
$(document).on("click", ".technique_title li", function () {
    $(this).css({
        "color": "#ff6525"
    }).siblings().css({
        "color": "#595757"
    });

    if ($(this).index() == "0") {
        $(".cooperation").eq($(this).index()).siblings("div").slideUp(300);
        $(".cooperation").eq($(this).index()).slideToggle(300, function () {
            techqiehuan();
        });
        $(".cooperation_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        })
    } else if ($(this).index() == "1") {
        $(".cooperation").eq($(this).index()).siblings("div").slideUp(300);
        $(".cooperation").eq($(this).index()).slideToggle(300, function () {
            techqiehuan();
        });
        $(".cooperation_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        })
    } else if ($(this).index() == "2") {}

    event.stopPropagation();
});
//专利
$(document).on("click", ".patent_title li", function () {
    $(this).css({
        "color": "#ff6525"
    }).siblings().css({
        "color": "#595757"
    });

    if ($(this).index() == "0") {
        $(".patent_down").eq($(this).index()).siblings("div").slideUp(300);
        $(".patent_down").eq($(this).index()).slideToggle(300, function () {
            patentqiehuan();
        });
        $(".patent_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    } else if ($(this).index() == "1") {
        $(".patent_down").eq($(this).index()).siblings("div").slideUp(300);
        $(".patent_down").eq($(this).index()).slideToggle(300, function () {
            patentqiehuan();
        });
        $(".patent_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    } else if ($(this).index() == "2") {
        $(".patent_down").eq($(this).index()).siblings("div").slideUp(300);
        $(".patent_down").eq($(this).index()).slideToggle(300, function () {
            patentqiehuan();
        });
        $(".patent_nav span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
    }

    event.stopPropagation();
});