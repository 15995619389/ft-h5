Vue.component("quickpublish", {
    template:
        '<div class="nav-tab-item tab-list" >' +
            '<div id="quick-pull" v-on:click="Show">' +
                '<span class="tab-icon pu-icon icon-pull" style="top:-0.6rem;"></span>' +
                '<span class="mui-tab-label" style="margin-top: -0.7rem;">快速发布</span>' +
            '</div>' +
        '<div id="component-quickpublish">' +
            '<div class="shadow"></div>'+
            '<div class="panel">' +
                '<ul>' +
                    '<li v-on:click="Demand"><a><span class="icon"><i class="pic demand"></i></span><span class="text">发布需求</span></a></li>' +
                    '<li v-on:click="Tech"><a><span class="icon"><i class="pic tech"></i></span><span class="text">发布技术</span></a></li>' +
                '</ul>' +
                '<div class="close" v-on:click="Close"><i></i></div>' +
                '</div>' +
            '</div>' +
        '</div>'
    ,
    data: function () {
        return {};
    },
    methods: {
        Show: function () {
            $("#component-quickpublish").addClass("show");
            //$("#quick-pull").css({ "transform": "scale(0)" });
            $('html,body').addClass("Ovhidden");
            $('body').bind("touchmove", function (e) {
                e.preventDefault();
            });
        },
        Close: function () {
            $("#component-quickpublish").removeClass("show");
            //$("#quick-pull").css({ "transform": "scale(1)" });
            $('html,body').removeClass("Ovhidden");
            $('body').unbind("touchmove");
        },
        IsLogin: function () {
            if (StorageService.Get("i_login")) {
                return true;
            } else {
                return false;
            }
        },
        Demand: function () {
            if (this.IsLogin()) {
                $.take({
                    type: "get",
                    url: "/user/complete",
                    success: function (res) {
                        if (res.err_code == "401") {
                            window.location.href = "/passport/login";
                        }
                        else if (res.data == 0) {
                            mui.toast("请先完善个人信息！");
                        }else{
                            window.location.href = "/demand/publish";
                        }
                    }
                });
            } else {
                window.location.href = "/passport/login";
            }
        },
        Tech: function () {
            if (this.IsLogin()) {
                $.take({
                    type: "get",
                    url: "/user/complete",
                    success: function (res) {
                        if (res.err_code == "401") {
                            window.location.href = "/passport/login";
                        }
                        else if (res.data == 0) {
                            mui.toast("请先完善个人信息！");
                        } else {
                            window.location.href = "/techshare/publish";
                        }
                    }
                });
            } else {
                window.location.href = "/passport/login";
            }
        }
    }
});

if ($("#bottom-nav").length>0) {
    var quickPublish = new Vue({
        el: "#bottom-nav"
    });
}

