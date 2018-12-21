import Vue from "vue";
import * as StorageService from "../../modules/StorageService";
import searchbar from "../../components/searchbar/SearchBar.vue";
import VueLazyload from 'vue-lazyload'
import Router from "vue-router";
import Recommend from "./recommend.vue";
import Solutions from "./solutions.vue";
import SpaceTech from "./SpaceTech.vue";
import rightsidebar from "../../components/RightSideBar.vue";

Vue.use(Router);

var router = new Router({
    routes: [
        {
            path:"/",
            redirect:"/recommend"
        },
        {
            path: "/recommend",
            name: "recommend",
            component: Recommend
        },
        {
            path:"/spacetech",
            name:"spacetech",
            component: SpaceTech
        },
        {
            path: "/solutions",
            name: "solutions",
            component: Solutions
        }
    ]
});

var vm = new Vue({
    router,
    components: {
        searchbar,
        rightsidebar
    },
    el: "#app",
    data: {
        IsTabVisible:false,
        Tabs:{
            recommend:"技术推荐",
            solutions:"行业解决方案",
            spacetech:"航天技术"
        }
    },
    created: function () {
        StorageService.Set("goSearchType", 1);
    },
    mounted: function () {

    },
    methods: {
        ToggleTab: function () {
            this.IsTabVisible = !this.IsTabVisible;
        },
        GoSubView:function(path){
            router.replace(path);
            this.IsTabVisible = false;
        }
    }
});