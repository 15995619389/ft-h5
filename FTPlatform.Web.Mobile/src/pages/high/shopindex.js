import Vue from "vue";
import searchbar from "../../components/searchbar/SearchBar.vue";
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import { GetParamUrl } from '../../modules/UrlService'

var vm = new Vue({
    el:'#container',
    components: {
        searchbar:searchbar,
        scroller: scroller.Scroller,
    },
    data:{
        shop:{score:0},
        shoparticle:[],
        searchmodel:{sortType: 1,merchantId:0,pageIndex:0}
    },
    //所有函数执行前
    created: function() {
        var self=this;
        if (!GetParamUrl("shopId")) {
            window.location.href = '/higharticlelist'
            return
        }
        self.$data.searchmodel.merchantId=GetParamUrl("shopId")
    },
    //方法，只要调用它，函数就会执行
    methods:{
        //排序
        TechDes: function(status) {
            if (status == 1) {
                if (this.$data.searchmodel.sortType == 1) {
                    this.$data.searchmodel.sortType = 2;
                } else {
                    this.$data.searchmodel.sortType = 1;
                }
                this.$refs.scroller_patent.scrollTo(0, 0);
                this.$refs.scroller_patent.triggerPullToRefresh();
            } else if (status == 2) {
                if (this.$data.searchmodel.sortType == 3) {
                    this.$data.searchmodel.sortType = 4;
                } else {
                    this.$data.searchmodel.sortType = 3;
                }
                this.$refs.scroller_patent.scrollTo(0, 0);
                this.$refs.scroller_patent.triggerPullToRefresh();
            } else {
                if (this.$data.searchmodel.sortType == 5) {
                    this.$data.searchmodel.sortType = 6;
                } else {
                    this.$data.searchmodel.sortType = 5;
                }
                this.$refs.scroller_patent.scrollTo(0, 0);
                this.$refs.scroller_patent.triggerPullToRefresh();
            }
        },
        search:function(fn){         
            var self = this;
            var data = self.$data;
            client.Request({
                url: '/highs/articlelist',
                type: 'GET',
                data: data.searchmodel,
                success: function (result) {   
                    if(result && result.Code == "200"){
                        if(typeof fn == "function"){
                            fn(result);
                        }else{
                            data.shop=result.Data
                            data.shoparticle = result.Data.article
                        }         
                    }else{
                        window.location.href='/higharticlelist'
                    }
                },
                error:function(){
                },
                complete:function(){
                },
            });
        },
        Refresh:function(bone){
            var self = this;
            var data = self.$data;

            data.searchmodel.pageIndex = 1;

            setTimeout(function () {
                self.search();
            }, 500);

            bone(false);
        },
        Append:function(bone){
            var self = this;
            var data = self.$data;          
            data.searchmodel.pageIndex++;
            setTimeout(function () {
                self.search(function(result){
                    data.shop=result.Data
                    var ismore = true;
                    for (var i = 0; i < result.Data.article.length; i++) {
                        data.shoparticle.push(result.Data.article[i]);
                    }

                    if (result.Data && result.Data.article.length > 0)
                        ismore = false;
                    bone(ismore);
                });
            }, 500);
            
        },
    },
})