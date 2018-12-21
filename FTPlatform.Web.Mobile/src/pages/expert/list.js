import Vue from "vue";
import * as client from "../../modules/ApiClient";
import scroller from "vue-scroller";
import searchbar from "../../components/searchbar/SearchBar.vue";
import { GetParamUrl } from "../../modules/UrlService";
import foot from "../../components/foot-nav-sm/foot-nav-sm.vue";
import rightsidebar from "../../components/RightSideBar.vue";

var vm = new Vue({
    components: {
        scroller: scroller.Scroller,
        searchbar,
        foot,
        rightsidebar
    },
    el: "#container",
    data: {
        expertData: [],
        param: { pageIndex: 1, expertLevel: 0, expertType: 0, pageSize: 10 },
        LevelPannel: false,
        TypePannel: false,
        paddingTop: 40,
        FormatExpertType: "",
        loading: false
    },
    created: function() {

        client.Storage.Set("goSearchType", 1);
        $("body").on("touchmove", function(e) {
            if (!$(".l-scrollable").has($(e.target)).length) {
                e.preventDefault();
            }
        });
    },
    mounted: function() {
        var self = this;
        this.$refs.foot.Init(self.PickCategory);
        this.Init();
    },
    methods: {
        Init: function() {
            if (GetParamUrl("level") != null && GetParamUrl("level") != "" && GetParamUrl("level") != undefined) {
                this.$data.param.expertLevel = parseInt(GetParamUrl("level"));
            }
            if (GetParamUrl("type") != null && GetParamUrl("type") != "" && GetParamUrl("type") != undefined) {
                this.$data.param.expertType = parseInt(GetParamUrl("type"));
            }
        },
        Get: function(callback) {
            client.Request({
                type: "get",
                url: "/expert/v2/list",
                data: this.$data.param,
                success: function(res) {
                    callback(true, res);
                },
                error: function(res) {
                    callback(false, null);
                }
            });
        },
        Search: function(done) {
            var _self = this;
            _self.$data.loading = true;
            _self.$data.param.pageIndex = 1;
            _self.Get(function(success, res) {
                if (success) {
                    _self.$data.expertData = res.Data || [];
                }
                _self.$data.loading = false;
                if (done) {
                    done();
                }
            });
        },
        Append: function(done) {
            var _self = this;
            if (this.CheckLoading()) {
                done();
                return;
            }
            var ismore = false;
            if (this.$data.expertData.length) {
                _self.$data.param.pageIndex += 1;
            } else {
                this.$data.param.pageIndex = 1;
            }
            this.Get(function(success, res) {
                if (success) {
                    var list = res.Data || [];
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.expertData.push(list[i]);
                        }
                    } else {
                        ismore = true;
                    }
                }
                if (res == null) {
                    ismore = true;
                }
                done(ismore);
            });
        },
        PickCategory: function(arr) {
            var self = this;
            var param = {};
            if (arr[0] && arr[0].Id) {
                param.categoryLv1 = arr[0].Id;
                self.$data.FormatExpertType = arr[0].Name;
            } else {
                param.categoryLv1 = 0;
                self.$data.FormatExpertType = "";
            }

            if (arr[1] && arr[1].Id) {
                param.categoryLv2 = arr[1].Id;
            } else {
                param.categoryLv2 = 0;
            }

            if (arr[2] && arr[2].Id) {
                param.categoryLv3 = arr[2].Id;
            } else {
                param.categoryLv3 = 0;
            }

            $.extend(this.$data.param, param);
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        LevelSort: function(status) {
            this.$data.param.expertLevel = status;
            this.$data.LevelPannel = false;
            this.$data.paddingTop = 40;
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        TypeSort: function(status) {
            this.$data.param.expertType = status;
            this.$data.TypePannel = false;
            this.$data.paddingTop = 40;
            this.$refs.scroller.scrollTo(0, 0);
            this.$refs.scroller.triggerPullToRefresh();
        },
        LevelStatus: function() {
            this.$data.TypePannel = false;
            if (this.$data.LevelPannel) {
                this.$data.LevelPannel = false;
                this.$data.paddingTop = 40;
            } else {
                this.$data.LevelPannel = true;
                this.$data.paddingTop = 70;
            }
        },
        TypeStatus: function() {
            this.$data.LevelPannel = false;
            if (this.$data.TypePannel) {
                this.$data.TypePannel = false;
                this.$data.paddingTop = 40;
            } else {
                this.$data.TypePannel = true;
                this.$data.paddingTop = 70;
            }
        },
        Detail: function(id) {
            window.location.href = "/expert/detail/" + id;
        },
        CheckLoading: function() {
            var self = this;
            if (this.$data.loading) {
                setTimeout(function() {
                    self.CheckLoading();
                }, 2000);
            } else {
                return false;
            }
        }
    }
});