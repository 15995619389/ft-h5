import * as client from "../../modules/ApiClient";
import Vue from "vue";
import { Toast } from 'mint-ui';
import foot from "../../components/mall-nav/mall-nav.vue"

var title = unescape(getQueryStringV(location.href,"title"));
if (title != "" && title != null && title != 'undefined') {
    $(".search_box>span>input").val(title);
}
var vm = new Vue({
    el: ".mui-content",
    components:{
        foot,
    },
    data: {
        modityAttry: [],
        search: {
            search: "",
            sorceAttr: "",
            shopType: 0,
            pageIndex: 1,
            pageSize: 8,
        },
        LoadingType: false,
    },
    methods: {
        Reresh: function () {
            var _modment = this;
            _modment.search.pageIndex = 1;
            let instance  = Toast({ message: '正在加载...', position: 'middle', duration: -1 });
            client.Request({
                type: "get",
                data: _modment.search,
                url: "/mall/searchmodity",
                success: function (result) {
                    _modment.modityAttry = result.Entitys;
                },
                complete: function () {
                    instance.close();
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);
                    mui('#pullrefresh').pullRefresh().refresh(true);//重置上拉加载
                    _modment.LoadingType = false;
                }
            })
        },
        AddReresh: function () {
            var _modment = this;
            _modment.search.pageIndex += 1;
            client.Request({
                type: "get",
                data: _modment.search,
                url: "/mall/searchmodity",
                success: function (result) {
                    if (result.Entitys.length <= 0) {
                        _modment.LoadingType = true;
                    }
                    for (var i = 0; i < result.Entitys.length; i++) {
                        _modment.modityAttry.push(result.Entitys[i]);
                    }
                },
                complete: function () {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(_modment.LoadingType);
                }
            })
        },
        SearchArry: function (arry) {
            var _data = this;
            _data.search.shopType = 0;
            _data.search.sorceAttr = arry;
            var search = $(".search_box>span>input").val();
            if (search != "" && search != null && search != 'undefined') {
                _data.search.search = search
            } else {
                _data.search.search = "";
            }
            _data.Reresh();
        },
        SearchType: function (type) {
            var _data = this;
            _data.search.shopType = type;
            _data.search.sorceAttr = "";
            var search = $(".search_box>span>input").val();
            if (search != "" && search != null && search != 'undefined') {
                _data.search.search = search;
            } else {
                _data.search.search = "";
            }
            _data.Reresh();
        },
        Detail: function (code) {
            location.href = "/mall/Detail/" + code;
        },
    },
    created: function () {
        var _data = this;
        var title = unescape(getQueryStringV(location.href,"title"));
        if (title != "" && title != null && title != 'undefined') {
            _data.search.search = title;
            $(".search_box>span>input").focus();
        }
    }
});
mui.init({
    pullRefresh: {
        container: "#pullrefresh",
        down: {
            style: 'circle',
            color: '#2BD009',
            contentover: "释放立即刷新",
            contentrefresh: "正在刷新...",
            auto: true,
            height: 50,
            callback: function () {
                vm.Reresh();
            }
        },
        up: {
            contentrefresh: "正在加载...",
            contentnomore: '没有更多数据了',
            callback: function () {
                vm.AddReresh();
            }
        }
    },
});
mui('.mui-content').on('tap', '#ModityCode', function (e) {
    var id = this.getAttribute('code');
    vm.Detail(id);
});
$("#Search").click(function () {
    var search = $(".search_box>span>input").val();
    location.href = "/mall/List?title=" + escape(search);

});
$(document).keyup(function (event) {
    var search = $(".search_box>span>input").val();
    if (event.keyCode == 13 && search != "" && search != null && search != "undefined") {
        location.href = "/mall/List?title=" + escape(search);
    }
    else if (event.keyCode == 13) {
        location.href = "/mall/List?title=" + escape(search);
    }

});
function getQueryStringV(vhref, name) {
    if (vhref.indexOf("?") == -1 || vhref.indexOf(name + '=') == -1) {
        return '';
    }
    var queryString = vhref.substring(vhref.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
}