<template>
    <div v-cloak>
        <div class="oHeader1" v-show="!isshowsearchbar&&!IsHome">
            <a href="javascript:history.go(-1);" class="mui-icon mui-icon-arrowleft mui-icon-left-nav mui-pull-left"></a>
            <div class="search retrie" style="float: left;">
                <a id="area" href="javascript:;" style="color: #969696;">
                    <input type="text" id="search-text" v-on:click="showsearchbar" class="seek" value="" style="width: 4.0rem;height: 0.42rem;border: none;margin-left:0.25rem;padding: 0px 0px;margin-bottom: 0px;padding-left: 10px;color: #000;">
                </a>
                <a class="on_seek" v-on:onclick="search">
                    <img src="/Content/image/seek_top.png" class="seek_img">
                </a>
            </div>
        </div>
        <div v-show="!isshowsearchbar&&IsHome">
            <a href="/">
                <div class="logo">
                </div>
            </a>
            <div class="search_box" id="search-text" v-on:click="showsearchbar">
                <i></i>
                <div class="input-text"></div>
            </div>
            <div class="pullbar" v-on:click="ToggleOptions">
                <i></i>
            </div>
            <div class="under-gird" tabindex="1" >
                <ul>
                    <li>
                        <a v-on:click="golocation('/expert/applysupplier')" href="javascript:" class="apply">申请供方</a>
                    </li>
                    <li>
                        <a v-on:click="golocation('/activity/')" href="javascript:" class="hotact">热门活动</a>
                    </li>
                    <li>
                        <a v-on:click="golocation('/about/')" href="javascript:" class="aboutus">关于我们</a>
                    </li>
                    <li>
                        <a v-on:click="golocation('/news/index')" href="javascript:" class="news">飞天动态</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="searchfixd" v-if="isshowsearchbar">
            <div class="mui-bar mui-bar-nav">
                <div class="oHeader1">
                    <a class="mui-icon-arrowleft mui-icon mui-icon-left-nav mui-pull-left" href="javascript:" v-on:click="closebar()" id="searchback"></a>
                    <div class="search retrie" style="float: left;">
                        <input id="txt_searchbar" type="text" class="seek search-inpt" v-bind:placeholder="placeholderKsy" v-model="searchKey" @keyup.enter="search" v-focus>
                        <a class="on_seek" v-on:click="search">
                            <img src="/content/image/seek_top.png" class="seek_img">
                        </a>
                    </div>
                </div>
            </div>
            <div class="seaech-main" style="background: #fff;">
                <section class="search-wrap">
                    <div class="recent-box" v-if="skeys.length > 0">
                        <div class="recent-inner">
                            <span class="search-tit" style="width:95%">最近搜索</span>
                            <a href="javascript:">
                                <span class="del-icon" v-on:click="openclare">
                                    <i></i>
                                </span>
                            </a>
                        </div>
                        <div class="recent-list">
                            <ul>
                                <span v-for="(key,index) in skeys" v-bind:key="index">
                                    <a href="javascript:" v-on:click="goSearch(key)">{{key}}</a>
                                </span>
                            </ul>
                        </div>
                    </div>
                    <div class="hot-search" v-if="hotbuss.length>0">
                        <h3>热门行业</h3>
                        <ul>
                            <li v-for="(bus, index) in hotbuss" v-bind:key="bus.Id">
                                <a href="javascript:" v-on:click="goSearch(bus.Name)">{{bus.Name}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="delete-item">
                        <h4>确定要清空搜索记录吗？</h4>
                        <div class="delete-btngroup">
                            <a v-on:click="clareSearch" href="javascript:">是</a>
                            <a v-on:click="closeSearchBar" href="javascript:">否</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import * as StorageService from '../../modules/StorageService'
import * as client from '../../modules/ApiClient'

var local_skeys = StorageService.Get('searchkeys') || []
var local_hotbuss = StorageService.Get('hotBuss') || {}

export default {
    name: 'SearchBar',
    data: function () {
        return {
            searchType: 0,
            searchKey: '',
            placeholderKsy: '',
            skeys: local_skeys || [],
            hotbuss: local_hotbuss || {},
            isshowsearchbar: false,
            IsHome: false
        }
    },
    props: ['skey', 'stype'],
    created: function () {
        var self = this
        client.Request({
            url: '/categories/v2/' + 1 + '?ctype=query',
            success: function (result) {
                self.hotbuss = result
                StorageService.Set('hotBuss', result)
            },
            complete: function (result) {

            }
        })
        this.searchType = this.stype || -1
        this.searchKey = this.skey || ''
    },
    directives: {
        focus: {
            inserted: function (el) {
                // 聚焦元素
                el.focus()
            }
        }
    },
    methods: {
        Init: function (isHome) {
            if (isHome) {
                this.$data.IsHome = true
            } else {
                this.$data.IsHome = false
            }
        },
        ToggleOptions: function () {
            $('.under-gird').toggle()

            setTimeout(function () {
                if ($('.under-gird').css('display') != 'none') {
                    $('body').one('touchmove', function (e) {
                        $('.under-gird').hide()
                        e.preventDefault()
                    })
                }
            }, 200)
        },
        golocation: function (url) {
            $('.under-gird').hide()
            window.location.href = url
        },
        clareSearch: $.proxy(function () {
            var data = this.$data
            data.skeys = []
            StorageService.Set('searchkeys', '')
            this.closeSearchBar()
        }),
        closeSearchBar: function () {
            $('.delete-item').css('display', 'none')
        },
        closebar: function () {
            this.isshowsearchbar = false
            $('body').removeClass('body-overflow')
            $('.body_content').removeClass('content-display')
        },
        search: function () {
            var data = this.$data
            if (data.searchKey && data.searchKey != '') {
                data.skeys.push(data.searchKey)
            }

            if (data.searchKey == undefined || data.searchKey == 'null') {
                data.searchKey = ''
            }

            StorageService.Set('searchkeys', data.skeys)
            // location.href = '/search/?stype=' + data.searchType + '&skey=' + data.searchKey;
            this.goSearch()
        },
        goSearch: function (seaText) {
            var text = this.searchKey
            if (seaText && seaText != '') {
                text = seaText
            }

            // var nt = StorageService.Get("goSearchType");
            // if (Number(nt) && Number(nt) > 0)
            //    this.searchType = Number(nt);

            // if (this.searchType < 0)
            //    this.searchType = 0;

            window.location.href = '/search/?stype=' + this.searchType + '&skey=' + text
        },
        openclare: function () {
            $('.delete-item').css('display', 'block')
        },
        showsearchbar: function () {
            this.isshowsearchbar = true
            $('body').addClass('body-overflow')
            $('.body_content').addClass('content-display')
            setTimeout(function () {
                // $('#txt_searchbar').focus();
            }, 200)
        }
    }
}
</script>

<style type="text/css">
.body-overflow {
  overflow: hidden;
}

.content-display {
  display: none;
}

/*新增搜索跳转页面样式*/

.searchfixd {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  font: 13px/1.5 arial;
  z-index: 999999;
  background-color: #fff;
  display: block;
}

.search-wrap {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  margin-top: 20px;
}

.search-wrap .recent-inner {
  overflow: hidden;
}

.search-wrap .recent-inner span {
  float: left;
}

.search-wrap .recent-inner .del-icon {
  width: 0.25rem;
  height: 0.26rem;
  display: inline-block;
  background: url(/content/image/del.png) no-repeat;
  background-size: 100% 100%;
  float: left;
  margin-top: 5px;
}

.search-wrap .recent-inner .search-tit {
  width: 95%;
  color: #666;
  font-size: 0.28rem;
  text-align: left;
}

.search-wrap .recent-list {
  width: 100%;
  overflow: hidden;
}

.search-wrap ul {
  border-top: none;
  margin-top: 0.2rem;
  overflow: hidden;
  padding-left: 0;
}

.search-wrap .recent-list ul span {
  /*width: 22%;*/
  float: left;
  height: 0.46rem;
  text-align: left;
  line-height: 0.46rem;
  border: none;
  margin-right: 3%;
  color: #969696;
}

.search-wrap .recent-list ul span a {
  color: #969696;
}

.search-wrap .hot-search ul li {
  <!--width: 22%;
  -->: left;
  height: 0.56rem;
  text-align: left;
  line-height: 0.56rem;
  border: none;
  margin-right: 3%;
  margin-bottom: 10px;
  color: #969696;
  border-radius: 5px;
  float: left;
}

.search-wrap .hot-search {
  width: 100%;
  margin-top: 0.2rem;
}

.search-wrap .hot-search h3 {
  font-size: 0.28rem;
  display: block;
  color: #666;
  font-weight: 500;
}

.search-inpt {
  margin-left: 0.2rem;
}

.delete-item {
  background: #444;
  opacity: 0.8;
  border-radius: 5px;
  position: absolute;
  top: 1.8rem;
  width: 60%;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  left: 20%;
  padding: 0.3rem;
  box-sizing: border-box;
  display: none;
}

.delete-item h4 {
  font-weight: 500;
  font-size: 0.28rem;
}

.delete-item .delete-btngroup {
  width: 100%;
  margin: 0 auto;
  margin-top: 0.4rem;
}

.delete-item .delete-btngroup a {
  display: inline-block;
  width: 40%;
  color: #fff;
  font-size: 0.3rem;
}

.searchfixd input[type="text"] {
  width: 90%;
  padding: 0 0;
  text-align: center;
  font-size: 0.26rem;
  line-height: 25px;
  height: 25px;
}

.seaech-main {
  padding-top: 10px;
}

/*------------*/

.oHeader1 {
  width: 100%;
  height: 100%;
  position: relative;
}

.search {
  position: absolute;
  top: 9px;
  right: 0px;
  height: 27px;
  width: 92%;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.on_seek {
  width: 0.5rem;
  height: 100%;
  position: absolute;
  right: 0.11rem;
}

#search-text {
  margin-left: 0.1rem;
}

/*新增搜索跳转页面样式*/

.searchfixd {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  font: 13px/1.5 arial;
  z-index: 999999;
  background-color: #fff;
  display: block;
}

.search-wrap {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  margin-top: 20px;
}

.search-wrap .recent-inner {
  overflow: hidden;
}

.search-wrap .recent-inner span {
  float: left;
}

.search-wrap .recent-inner .del-icon {
  width: 0.25rem;
  height: 0.26rem;
  display: inline-block;
  background: url(/content/image/del.png) no-repeat;
  background-size: 100% 100%;
  float: left;
  margin-top: 5px;
}

.search-wrap .recent-inner .search-tit {
  width: 95%;
  color: #666;
  font-size: 0.28rem;
}

.search-wrap .recent-list {
  width: 100%;
  overflow: hidden;
}

.search-wrap ul {
  border-top: none;
  margin-top: 0.2rem;
  overflow: hidden;
  padding-left: 0;
}

.search-wrap .recent-list ul span {
  /*width: 22%;*/
  float: left;
  height: 0.46rem;
  text-align: left;
  line-height: 0.46rem;
  border: none;
  margin-right: 3%;
  color: #969696;
}

.search-wrap .recent-list ul span a {
  color: #969696;
}

.search-wrap .hot-search ul li {
  <!--width: 22%;
  -->: left;
  height: 0.56rem;
  text-align: left;
  line-height: 0.56rem;
  border: none;
  margin-right: 3%;
  margin-bottom: 10px;
  color: #969696;
  border-radius: 5px;
  float: left;
}

.search-wrap .hot-search {
  width: 100%;
  margin-top: 0.2rem;
}

.search-wrap .hot-search h3 {
  font-size: 0.28rem;
  display: block;
  color: #666;
  font-weight: 500;
  text-align: left;
}

.search-inpt {
  margin-left: 0.2rem;
}

.delete-item {
  background: #444;
  opacity: 0.8;
  border-radius: 5px;
  position: absolute;
  top: 1.8rem;
  width: 60%;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  left: 20%;
  padding: 0.3rem;
  box-sizing: border-box;
  display: none;
}

.delete-item h4 {
  font-weight: 500;
  font-size: 0.28rem;
}

.delete-item .delete-btngroup {
  width: 100%;
  margin: 0 auto;
  margin-top: 0.4rem;
}

.delete-item .delete-btngroup a {
  display: inline-block;
  width: 40%;
  color: #fff;
  font-size: 0.3rem;
}

.searchfixd input[type="text"] {
  width: 90%;
  padding: 0 0;
  text-align: center;
  font-size: 0.26rem;
  line-height: 25px;
  height: 25px;
}

input[type="text"] {
  height: 25px !important;
}

.seaech-main {
  padding-top: 10px;
}

/*------------*/

.oHeader1 {
  width: 100%;
  height: 100%;
  position: relative;
}

.search {
  position: absolute;
  top: 9px;
  right: 0px;
  height: 27px;
  width: 92%;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.on_seek {
  width: 0.5rem;
  height: 100%;
  position: absolute;
  right: 0.11rem;
}

#search-text {
  margin-left: 0.25rem;
}

input[type="text"] {
  border: none;
  height: 25px !important;
}

input[type="text"] {
  border: none;
}
.oHeader {
  z-index: 999;
}
.search-wrap ul li a {
  color: #969696;
  padding: 2px 5px;
  display: block;
  background: #f0f2f5;
  text-align: center;
  border-radius: 5px;
}
</style>
