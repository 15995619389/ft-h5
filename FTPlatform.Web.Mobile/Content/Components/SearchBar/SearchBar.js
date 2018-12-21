local_skeys = StorageService.Get("searchkeys") || [];
local_hotbuss = StorageService.Get("hotBuss") || {};

Vue.component("searchbar", {
    template: '<div class="searchfixd">'+
        '<div class="mui-bar mui-bar-nav">'+
            '<div class="oHeader1">'+
       '         <a class="mui-icon-arrowleft mui-icon mui-icon-left-nav mui-pull-left" href="javascript:" v-on:click="clasebar()" id="searchback"></a>'+
        '        <div class="search retrie" style="float: left;">'+
        '            <input id="txt_searchbar" type="text" class="seek search-inpt" :placeholder="placeholderKsy" maxlength="18" v-model="searchKey" v-focus="true" v-on:keyup.enter="search" style="height:25px !important">' +
        '            <a class="on_seek" v-on:click="search">'+
        '                <img src="/content/image/seek_top.png" class="seek_img">'+
        '            </a>'+
        '        </div>'+
        '    </div>'+
        '</div>'+
        '<div class="seaech-main" style="background: #fff;" >' +  //mui-content seaech-main
        '    <section class="search-wrap">'+
        '        <div class="recent-box" v-if="skeys.length > 0">'+
        '            <div class="recent-inner">'+
        '                <span class="search-tit">最近搜索</span>'+
        '                <a href="javascript:"><span class="del-icon" v-on:click="openclare"><i></i></span></a>'+
        '            </div>'+
        '            <div class="recent-list">'+
        '                <ul>'+
        '                    <span v-for="(key,index) in skeys" :key="index">' +
        '                        <a href="javascript:" v-on:click="goSearch(key)" >{{key}}</a>' +
        '                    </span>'+
        '                </ul>'+
        '            </div>'+
        '        </div>'+
        '        <div class="hot-search" v-if="hotbuss.length>0">'+
        '           <h3>热门行业</h3>'+
        '            <ul>'+
        '                <li v-for="(bus, index) in hotbuss" :key="bus.Id">' +
        '                    <a href="javascript:" v-on:click="goSearch(bus.ViewName)" >{{bus.ViewName}}</a>' +
        '                </li>'+
        '            </ul>'+
        '        </div>'+
        '        <div class="delete-item">'+
        '            <h4>确定要清空搜索记录吗？</h4>'+
        '            <div class="delete-btngroup">'+
        '                <a v-on:click="clareSearch" href="javascript:">是</a>'+
        '                <a v-on:click="closeSearchBar" href="javascript:">否</a>'+
        '            </div>'+
        '        </div>'+
        '    </section>'+
        '</div>'+
    '</div>',
    props: ['skey','stype'],
    data: function () {
        return {
            searchType:-1,
            searchKey: '',
            placeholderKsy: '',
            skeys: local_skeys || [],
            hotbuss: local_hotbuss || {},
        };
    },
    created: function () {
        var self = this;
        $.take({
            url: '/categories/' + 1,
            success: function (result) {
                self.hotbuss = result;
                StorageService.Set("hotBuss", result);
            }, complete: function (result) {

            }
        });

        this.searchType = this.stype;
        this.searchKey = this.skey;
        //setTimeout(function () {
        //    $(".seek").focus();
        //}, 500);
    },
    methods:{
        clareSearch: $.proxy(function () {
            var data = this.$data;
            data.skeys = [];
            StorageService.Set("searchkeys", "");
            this.closeSearchBar();
        }),
        closeSearchBar: $.proxy(function () {
            $(".delete-item").css("display", "none");
        }),
        clasebar: $.proxy(function () {
            $(".searchfixd").hide();
        }),
        search: $.proxy(function () {
            var data = this.$data;
            if (data.searchKey && data.searchKey != '')
                data.skeys.push(data.searchKey);

            if (data.searchKey == undefined || data.searchKey == "null")
                data.searchKey = "";

            StorageService.Set("searchkeys", data.skeys);
            //location.href = '/search/?stype=' + data.searchType + '&skey=' + data.searchKey;
            this.goSearch();
        }),
        goSearch: $.proxy(function (seaText) {
            var text = this.searchKey;
            if (seaText && seaText != '')
                text = seaText;

            //var nt = StorageService.Get("goSearchType");
            //if (Number(nt))
            //    this.searchType = Number(nt);

            //if (this.searchType < 0)
            //    this.searchType = 0;

            location.href = '/search/?stype=' + this.searchType + '&skey=' + text;
        }),
        openclare: $.proxy(function () {
            $(".delete-item").css("display", "block");
        })
    },
});

//if ($("#Test_searchbar").length > 0) {
//    var searchBar = new Vue({
//        el: "#Test_searchbar"
//    });
//}
