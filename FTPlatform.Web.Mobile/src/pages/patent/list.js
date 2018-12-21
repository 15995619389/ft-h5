
import Vue from "vue";
import foot_item from "../../components/foot-nav-sm/foot-nav-sm-Item.vue";
import searchbar from "../../components/searchbar/SearchBar.vue";
import scroller from "vue-scroller";
import * as client from "../../modules/ApiClient";
import rightsidebar from "../../components/RightSideBar.vue";

var vm = new Vue({
    el:'#container',
    components: {
        searchbar:searchbar,
        scroller: scroller.Scroller,
        foot_item,
        rightsidebar
    },
    data:{
        patents:[],
        searchmodel:{
            tradeMode:'',//专利交易方式
            patentType:0,//专利类型
            patentStatus:0,//专利状态
            businessClassLevel1:0,
            sortType:0,
            pageIndex:0,
            pageSize:10,           
            PatentType:'',
            sortType: 1,
        }
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
                $("#side").animate({
                    width: '100%'
                }, 300);
            }
        },
        //专利交易方式
        TechTradWaySort: function(status) {
            this.$data.searchmodel.tradeMode = status;
        },
        //重置
        Reset: function() {
            this.$data.searchmodel.tradeMode = "";
            this.$data.searchmodel.patentStatus = 0;
            this.$data.searchmodel.patentType = 0;
        },
        //专利状态
        DevelPhaseSort: function(status) {
            this.$data.searchmodel.patentStatus = status;
        },
        //专利类型
        TyprSort: function(status) {
            this.$data.searchmodel.patentType = status;
        },
        //确定
        TechSort: function() {
            this.MaskboxHide();
            this.$refs.scroller_patent.scrollTo(0, 0);
            this.$refs.scroller_patent.triggerPullToRefresh();
        },
        //侧边栏运动
        MaskboxHide: function() {
            $("#side").animate({
                width: '0%'
            }, 300);
        },
        search:function(fn){         
            var self = this;
            var data = self.$data;
            client.Request({
                url: '/tech/patentlist',
                type: 'get',
                data: data.searchmodel,
                beforeSend: function () {
                    
                },
                success: function (result) {
                   
                    if(result && result.Code == "200"){
                        if(typeof fn == "function")
                            fn(result);
                        else
                            data.patents = result.Data;
                    }
                },
                error:function(){
                },
                complete:function(){
                },
            });
        },
        searchfiter:function(l, d){
        
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
                    for (var i = 0; i < result.Data.length; i++) {
                        data.patents.push(result.Data[i]);
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
            self.$data.searchmodel.businessClassLevel1 = categoryLv1.value;
            self.$refs.scroller_patent.scrollTo(0, 0);
            self.$refs.scroller_patent.triggerPullToRefresh();
            //self.search();
        },
    },
})
//vm.search();