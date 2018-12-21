import Vue from "vue";
import * as client from "../../modules/ApiClient";
import { GetIdFromUrl } from "../../modules/UrlService";
import { Popup,Toast } from "mint-ui";
import preview from "../../components/img-preview.vue";
import rightsidebar from "../../components/RightSideBar.vue";

Vue.filter('formatDate', function (value,len) {
    if (value != null && value != "") {
        if (len) {
            return value.substring(0, len);
        } else {
            return value.substring(0, 10);
        }
    }
});

var vm = new Vue({
    el: '.js-particulars',
    components: {
        preview,
        rightsidebar
    },
    data: {
        detail: {},
        TechSupplier: ["", "技术独立开发者", "技术联合研发者", "技术代理者", "其他"],
        DevelPhase: ["", "研发", "小试", "中试", "已有样品", "产业化"],
        TechTradWay: ["", "风险投资", "研发合同", "技术入股", "授权许可", "出售"],
        Preview: false,
        domain: "",
        currentUser: null,
        techId: "",
        applyPopup: false,
        consultPopup: false,
        IsFollow: false,
        BusinessNewCategory:null,
        isLoding:false,
    },
    created: function () {
        var darr = $("#ApiUrl").val().split("/");
        this.$data.domain = darr.slice(0, darr.length - 1).join("/");
        if (!GetIdFromUrl()) {
            window.location.href = "/techshare";
            return;
        }
        this.$data.techId = GetIdFromUrl();
        this.$data.currentUser = client.GetCurrentUser();
        this.initData();
    },
    methods: {
        initData: function () {
            var data = this.$data;
            if(!data.isLoding){
                data.isLoding=true
                client.Request({
                    type: "get",
                    url:"/tech/v2/recommenddetail/"+data.techId,
                    async:false,
                    success: function (resultObj) {
                        var user = data.currentUser;
                        var result=resultObj.Data;
                        data.detail = result;
                        if(result.BusinessNewCategory){
                            data.BusinessNewCategory=result.BusinessNewCategory;
                        }
                        if (data.detail.TechTradWay) {
                            data.detail.TechTradWay = data.detail.TechTradWay.split(",");
                        } else {
                            data.detail.TechTradWay = [];
                        }

                        data.detail.AbutCount = result.GetTechAbutment.length
                        if (result.TechAttachAll && result.TechAttachAll.length == 0) {
                            $("#EconomyAnalyze").css({ "border-bottom": "none" });
                        }
                        if (result.GetTechFollow.length > 0 && user) {
                            $(result.GetTechFollow).each(function (i, m) {
                                if (m.UserId == user.Id) {
                                    data.IsFollow = true;
                                }
                            });
                        }
                        if (result.GetTechAbutment.length > 0 && user) {
                            $(result.GetTechAbutment).each(function (i, but) {
                                if (but.WebUserId == user.Id) {
                                    $('.bt').css("display", "block");
                                    $('#apply').html("已申请");
                                    $('#apply').css("background", "darkgray");
                                }
                            })
                        }
                        if (result.Status == 3) {
                            $('.three-label').css("display", "block");
                            $("#attention").css("display", "block");
                        }
                        if ((user && result.UserId != user.Id) || user == null || user == false) {
                            $('.bt').css("display", "block");
                        }
                        if (user != null && result.UserId == user.Id) {
                            //$(".mui-bar").find("a").eq(1).css("display", "none")
                            $('.Iwant').css("display", "block");
                        }
                    }, complete: function (XMLHttpRequest, textStatus) {
                        data.isLoding=false
                    }
                });
            }
        },
        ShowPreview: function() {
            this.$refs.preview.Show(this.$data.detail.ImgUrl);
        },
        Follow: function () {
            var self = this;
            if (!self.$data.currentUser) {
                window.location.href = client.LoginReturn(location.href);
            } else {
                client.Request({
                    type: "post",
                    url: "/tech/follow" + "?id=" + self.$data.techId,
                    success: function (result) {
                        if (result.StausCode == "200") {
                            self.IsFollow = true;
                            self.$data.detail.FollowNum += 1;
                        }
                        if (result.StausCode == "202") {
                            self.IsFollow = false;
                            if (self.$data.detail.FollowNum > 0) {
                                self.$data.detail.FollowNum -= 1;
                            }
                        }
                        Toast({message:result.Message,duration:1000});
                    }
                });
            }
        },
        ApplyTech: function () {
            var self = this;
            client.Request({
                type: "post",
                url: client.Api.applytech + '?id=' + self.$data.techId,
                success: function (result) {
                    if (result.Flag) {
                        self.$data.applyPopup = false;
                        $("#mask").hide();
                        self.initData();
                    }
                    Toast({message:result.Message,duration:2000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $(".js-particulars").addClass("l-scrollable");
                }
            });
        },
        ConsultTech: function () {
            var self = this;
            if ($('.textarea').val() == "")
                return;
            client.Request({
                type: "post",
                url: client.Api.consult + '?id=' + self.$data.techId + '&&content=' + $('.textarea').val(),
                success: function (result) {
                    if (result.Flag) {
                        self.$data.consultPopup = false;
                        $("#mask").hide();
                        self.initData();
                    }
                    Toast({message:result.Message,duration:2000});
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $(".js-particulars").addClass("l-scrollable");
                }
            });
        },
        ShowApplyPopup: function () {
            var self = this;
            if (!self.$data.currentUser) {
                window.location.href = client.LoginReturn(location.href);
                return;
            }
            if ($("#apply").html() == "已申请") {
                return;
            }
            $('#mask').css({
                display: 'block',
                height: $("html").height()
            });

            this.$data.applyPopup = true;
            $(".js-particulars").removeClass("l-scrollable");
        },
        ShowConsultPopup: function () {
            var self = this;
            if (!self.$data.currentUser) {
                window.location.href = client.LoginReturn(location.href);
                return;
            }

            $("#ConsultationContent").val("");
            $('#mask').css({
                display: 'block',
                height: $("html").height()
            })
            this.$data.consultPopup = true;
            $(".js-particulars").removeClass("l-scrollable");
        },
        PopupHide: function () {
            this.$data.applyPopup = false;
            this.$data.consultPopup = false;
            $("#mask").hide();
            $(".js-particulars").addClass("l-scrollable");
        }
    }
});