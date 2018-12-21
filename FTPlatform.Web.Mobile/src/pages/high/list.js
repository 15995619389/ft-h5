
import Vue from "vue";
import foot_item from "../../components/foot-nav-sm/foot-nav-sm-Item.vue";
import searchbar from "../../components/searchbar/SearchBar.vue";
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import rightsidebar from "../../components/RightSideBar.vue";
import * as StorageService from "../../modules/StorageService";


var vm = new Vue({
    el:'#container',
    components: {
        searchbar:searchbar,
        scroller: scroller.Scroller,
        foot_item,
        rightsidebar
    },
    data:{
        highList:[],
        highSList:[],
        searchmodel:{
            sortType: 1,//排序
            industryTag:0,//行业标签默认0
            merchantId:0,//商家id
            pageSize:10,
            pageIndex:0//
        }
    },
    created:function(){
        var self=this
    },
    //所有函数执行前
    mounted: function() {
        var self=this;
 
        self.$refs.footitem.Init(self.PickCategory);
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
            } else if (status == 2) {
                if (this.$data.searchmodel.sortType == 3) {
                    this.$data.searchmodel.sortType = 4;
                } else {
                    this.$data.searchmodel.sortType = 3;
                }
            } else {
                if (this.$data.searchmodel.sortType == 5) {
                    this.$data.searchmodel.sortType = 6;
                } else {
                    this.$data.searchmodel.sortType = 5;
                }
            }
            this.$refs.scroller_patent.scrollTo(0, 0);
            this.$refs.scroller_patent.triggerPullToRefresh();
        },
        search:function(fn){         
            var self = this;
            var data = self.$data;
            client.Request({
                url: '/highs/articlelist',
                type: 'get',
                data: data.searchmodel,
                success: function (result) {  
                    if(result && result.Code == "200"){
                        data.highSList=result.Data.articleS;
                        if(typeof fn == "function"){
                            fn(result);
                        }else{
                            data.highList = result.Data.article;
                        }         
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
                    var ismore = true;
                    for (var i = 0; i < result.Data.article.length; i++) {
                        data.highList.push(result.Data.article[i]);
                    }

                    if (result.data && result.data.length > 0)
                        ismore = false;
                    bone(ismore);
                });
            }, 500);
            
        },
        PickCategory:function(arr){
            var param = {};
            var categoryLv1 = arr;

            var self = this;
            self.$data.searchmodel.pageIndex = 1;
            self.$data.searchmodel.industryTag = categoryLv1.value;
            self.$refs.scroller_patent.scrollTo(0, 0);
            self.$refs.scroller_patent.triggerPullToRefresh();
        },
    },
})