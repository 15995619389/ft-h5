<script>
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import foot from "../../components/foot-nav-sm/foot-nav-sm.vue";

export default {
    data() {
        return {
            techData: [],
            param: {
                pageIndex: 1,
                pageSize: 10,
                sortType: 1,
                TechTradWay: 0,
                DevelPhase: 0
            },
            loading: false,
        }
    },
    components: {
        scroller: scroller.Scroller,
        foot
    },
    created() {

    },
    mounted() {
        var self = this;
        self.$refs.foot.Init(self.PickCategory);
    },
    filters: client.Filters,
    methods: {
        TechDes: function(status) {
            if (status == 1) {
                if (this.$data.param.sortType == 1) {
                    this.$data.param.sortType = 2;
                } else {
                    this.$data.param.sortType = 1;
                }
                this.$refs.scroller1.scrollTo(0, 0);
                this.$refs.scroller1.triggerPullToRefresh();
            } else if (status == 2) {
                if (this.$data.param.sortType == 3) {
                    this.$data.param.sortType = 4;
                } else {
                    this.$data.param.sortType = 3;
                }
                this.$refs.scroller1.scrollTo(0, 0);
                this.$refs.scroller1.triggerPullToRefresh();
            } else {
                $("#side").animate({
                    width: '100%'
                }, 300);
            }
        },
        TechTradWaySort: function(status) {
            this.$data.param.TechTradWay = status;
        },
        TechDetail: function(id) {
            window.location.href = "/techshare/detail/" + id;
        },
        Reset: function() {
            this.$data.param.TechTradWay = 0;
            this.$data.param.DevelPhase = 0;
        },
        DevelPhaseSort: function(status) {
            this.$data.param.DevelPhase = status;
        },
        PickCategory: function(arr) {
            var param = {};
            if (arr[0] && arr[0].Id) {
                param.BusinessClassLevel1 = arr[0].Id;
            } else {
                param.BusinessClassLevel1 = 0;
            }
            if (arr[1] && arr[1].Id) {
                param.BusinessClassLevel2 = arr[1].Id;
            } else {
                param.BusinessClassLevel2 = 0;
            }

            if (arr[2] && arr[2].Id) {
                param.BusinessClassLevel3 = arr[2].Id;
            } else {
                param.BusinessClassLevel3 = 0;
            }
            $.extend(this.$data.param, param);
            this.$refs.scroller1.scrollTo(0, 0);
            this.$refs.scroller1.triggerPullToRefresh();
        },
        TechSort: function() {
            this.MaskboxHide();
            this.$refs.scroller1.scrollTo(0, 0);
            this.$refs.scroller1.triggerPullToRefresh();
        },
        MaskboxHide: function() {
            $("#side").animate({
                width: '0%'
            }, 300);
        },
        GetTech: function(callback) {
            client.Request({
                type: "get",
                url: "/tech/v2/recommendlist",
                data: this.$data.param,
                success: function(res) {
                    callback(true, res);
                },
                error: function(res) {
                    callback(false, null);
                }
            });
        },
        techSearch: function(done) {
            var _self = this;
            _self.$data.loading = true;
            this.$data.param.pageIndex = 1;
            this.GetTech(function(success, res) {
                if (success) {
                    _self.$data.techData = res.Data;
                }
                _self.$data.loading = false;
                if (done) {
                    done();
                }
            });
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
        },
        techAppend: function(done) {
            var _self = this;
            if (this.CheckLoading()) {
                done();
                return;
            }
            var ismore = false;
            if (_self.$data.techData.length) {
                this.$data.param.pageIndex += 1;
            } else {
                this.$data.param.pageIndex = 1;
            }
            this.GetTech(function(success, res) {
                if (success) {
                    var list = res.Data;
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.techData.push(list[i]);
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
    }
}
</script>

<template>
    <div>
        <foot ref="foot"></foot>
        <div class="options">
            <ul class="nav_table">
                <li v-on:click="TechDes(1)">
                    <span class="sSpan" v-bind:class="{active:(param.sortType==1||param.sortType==2)}">时间</span>
                    <span class="up" style="margin-top:0.20rem">
                        <span class="mui-icon mui-icon-arrowup" v-bind:class="{active:(param.sortType==2)}"></span>
                        <span class="mui-icon mui-icon-arrowdown" v-bind:class="{active:(param.sortType==1)}"></span>
                    </span>
                </li>
                <li v-on:click="TechDes(2)">
                    <span class="sSpan" v-bind:class="{active:(param.sortType==3||param.sortType==4)}">关注度</span>
                    <span class="up" style="margin-top:0.20rem">
                        <span class="mui-icon mui-icon-arrowup" v-bind:class="{active:(param.sortType==4)}"></span>
                        <span class="mui-icon mui-icon-arrowdown" v-bind:class="{active:(param.sortType==3)}"></span>
                    </span>
                </li>
                <li id="screening_box" v-on:click="TechDes(3)">
                    <span class="sSpan">筛选</span>
                    <span class="up" style="margin-top:0.20rem">
                        <i class="screen_bg"></i>
                    </span>
                </li>
            </ul>
        </div>
        <scroller ref="scroller1" v-bind:on-refresh="techSearch" v-bind:on-infinite="techAppend" style="padding-top:80px;">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell" v-for="tech in techData" v-on:click="TechDetail(tech.Id)">
                    <a>
                        <img class="mui-media-object mui-pull-left" v-lazy="tech.ImgUrl">
                        <div class="content_body">
                            <div class="view_title">
                                <h3 class="title_left">{{tech.Title}}</h3>
                                <p class="year">{{tech.PblishTime|formatDate}}</p>
                            </div>
                            <p class="introduce">{{tech.Feature|html}}</p>
                            <ul class="apply_base">
                                <li>
                                    <img src="/Content/image/apply.png" class="apply_img" />
                                    <span>浏览量：
                                        <span>{{tech.BrowseNum}}</span>
                                    </span>
                                </li>
                                <li>
                                    <img src="/Content/image/attention.png" class="focus_img">
                                    <span>关注度：
                                        <span>{{tech.FollCount}}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </a>
                </li>
            </ul>
        </scroller>
        <div id="side">
            <div class="mask_box" v-on:click="MaskboxHide"></div>
            <div class="screening_box">
                <div class="screening_right">
                    <div class="teamwork">
                        <h3>交易方式</h3>
                        <ul class="teamwork_nav">
                            <li v-on:click="TechTradWaySort(0)" v-bind:class="{active:(param.TechTradWay==0)}">全部</li>
                            <li v-on:click="TechTradWaySort(5)" v-bind:class="{active:(param.TechTradWay==5)}">出售</li>
                            <li v-on:click="TechTradWaySort(4)" v-bind:class="{active:(param.TechTradWay==4)}">授权许可</li>
                            <li v-on:click="TechTradWaySort(3)" v-bind:class="{active:(param.TechTradWay==3)}">技术入股</li>
                            <li v-on:click="TechTradWaySort(2)" v-bind:class="{active:(param.TechTradWay==2)}">研发合同</li>
                            <li v-on:click="TechTradWaySort(1)" v-bind:class="{active:(param.TechTradWay==1)}">风险投资</li>
                        </ul>
                    </div>
                    <div class="teamwork">
                        <h3>研发阶段</h3>
                        <ul class="teamwork_nav">
                            <li v-on:click="DevelPhaseSort(0)" v-bind:class="{active:(param.DevelPhase==0)}">全部</li>
                            <li v-on:click="DevelPhaseSort(5)" v-bind:class="{active:(param.DevelPhase==5)}">产业化</li>
                            <li v-on:click="DevelPhaseSort(4)" v-bind:class="{active:(param.DevelPhase==4)}">已有样品</li>
                            <li v-on:click="DevelPhaseSort(3)" v-bind:class="{active:(param.DevelPhase==3)}">中试</li>
                            <li v-on:click="DevelPhaseSort(2)" v-bind:class="{active:(param.DevelPhase==2)}">小试</li>
                            <li v-on:click="DevelPhaseSort(1)" v-bind:class="{active:(param.DevelPhase==1)}">研发</li>
                        </ul>
                    </div>
                </div>
                <div class="footer_btn">
                    <button type="button" class="mui-btn reset" v-on:click="Reset">重置</button>
                    <button type="button" class="mui-btn determine" v-on:click="TechSort">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#side {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
}
</style>
