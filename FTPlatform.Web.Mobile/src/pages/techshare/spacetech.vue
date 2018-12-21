<script>
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import foot from "../../components/foot-nav-sm/foot-nav-sm.vue";

export default {
    data() {
        return {
            brandData: [],
            brandparam: {
                pageIndex: 1,
                pageSize: 10,
                sortName: 0,
                sortDirection: 0
            },
            loading2: false,
        }
    },
    filters: client.Filters,
    created() {

    },
    components: {
        scroller: scroller.Scroller,
        foot
    },
    methods: {
        CheckLoading2: function() {
            var self = this;
            if (this.$data.loading2) {
                setTimeout(function() {
                    self.CheckLoading2();
                }, 2000);
            } else {
                return false;
            }
        },
        GetBrand: function(callback) {
            client.Request({
                type: "get",
                url: "/unique/products/3",
                data: this.$data.brandparam,
                success: function(res) {
                    callback(true, res);
                },
                error: function(res) {
                    callback(false, null);
                }
            });
        },
        Sort: function(sort) {
            if (sort == this.$data.brandparam.sortName) {
                this.$data.brandparam.sortDirection = this.$data.brandparam.sortDirection == 0 ? 1 : 0;
            }
            this.$data.brandparam.sortName = sort;
            this.$refs.scroller2.scrollTo(0, 0);
            this.$refs.scroller2.triggerPullToRefresh();
        },
        BrandDetail: function(id) {
            window.location.href = "/unique/info/" + id;
        },
        brandSearch: function(done) {
            var _self = this;
            _self.$data.loading2 = true;
            this.$data.brandparam.pageIndex = 1;
            this.GetBrand(function(success, res) {
                if (success) {
                    _self.$data.brandData = res.Entitys;
                }
                _self.$data.loading2 = false;
                if (done) {
                    done();
                }
            });
        },
        brandAppend: function(done) {
            var _self = this;
            if (this.CheckLoading2()) {
                done();
                return;
            }
            var ismore = false;
            if (_self.$data.brandData.length) {
                this.$data.brandparam.pageIndex += 1;
            } else {
                this.$data.brandparam.pageIndex = 1;
            }
            this.GetBrand(function(success, res) {
                if (success) {
                    var list = res.Entitys;
                    if (list.length) {
                        for (var i = 0; i < list.length; i++) {
                            _self.$data.brandData.push(list[i]);
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
        <div id="ft-sort-bar" style="z-index:3;background:#f5f5f5">
            <div class="sort-bar-item" v-on:click="Sort(0)" style="padding-left:3%">
                <span class="text-time" v-bind:class="{active:(brandparam.sortName==0)}">发布时间</span>
                <span class="up">
                    <span class="mui-icon mui-icon-arrowup" v-bind:class="{active:(brandparam.sortName==0&&brandparam.sortDirection==1)}"></span>
                    <span class="mui-icon mui-icon-arrowdown" v-bind:class="{active:(brandparam.sortName==0&&brandparam.sortDirection==0)}"></span>
                </span>
            </div>
            <div class="sort-bar-item" v-on:click="Sort(1)">
                <span class="text-time" v-bind:class="{active:(brandparam.sortName==1)}">浏览量</span>
                <span class="up">
                    <span class="mui-icon mui-icon-arrowup" v-bind:class="{active:(brandparam.sortName==1&&brandparam.sortDirection==1)}"></span>
                    <span class="mui-icon mui-icon-arrowdown" v-bind:class="{active:(brandparam.sortName==1&&brandparam.sortDirection==0)}"></span>
                </span>
            </div>
            <div class="sort-bar-item" v-on:click="Sort(2)">
                <span class="text-time" v-bind:class="{active:(brandparam.sortName==2)}">业务咨询量</span>
                <span class="up">
                    <span class="mui-icon mui-icon-arrowup" v-bind:class="{active:(brandparam.sortName==2&&brandparam.sortDirection==1)}"></span>
                    <span class="mui-icon mui-icon-arrowdown" v-bind:class="{active:(brandparam.sortName==2&&brandparam.sortDirection==0)}"></span>
                </span>
            </div>
        </div>
        <scroller ref="scroller2" v-bind:on-refresh="brandSearch" v-bind:on-infinite="brandAppend" style="padding-top:80px;">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell mui-media" v-for="brand in brandData" v-on:click="BrandDetail(brand.Id)">
                    <a>
                        <img class="mui-media-object mui-pull-left" v-lazy="brand.ImgUrl">
                        <div class="content_body">
                            <div class="view_title">
                                <h3 class="title_left">{{brand.Title}}</h3>
                                <p class="year">{{brand.PublishTime|formatDate}}</p>
                            </div>
                            <p class="introduce">{{brand.Introduction|html}}</p>
                            <ul class="apply_base">
                                <li>
                                    <img src="/Content/image/apply.png" class="apply_img" />
                                    <span>浏览量：
                                        <span>{{brand.BrowseNum}}</span>
                                    </span>
                                </li>
                                <li>
                                    <img src="/Content/image/busConsultation.png" class="focus_img">
                                    <span>咨询量：
                                        <span>{{brand.BusinessReferCount}}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </a>
                </li>
            </ul>
        </scroller>
    </div>
</template>
<style>

</style>
