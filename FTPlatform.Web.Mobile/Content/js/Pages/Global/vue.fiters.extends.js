
Vue.filter('reverse', function (value) {
    return value.split('').reverse().join('')
});

Vue.filter('formatDate', function (value) {
    if (value != null && value != "") {
        return value.substring(0, 10);
    }
});

Vue.directive('focus', {
    // 当绑定元素插入到 DOM 中。
    inserted: function (el) {
        // 聚焦元素
        el.focus();
    }
})

Vue.filter('removeHTMLTag', function (str) {
    if (str != null && str != "" & str != undefined) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/ /ig, '');//去掉
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/\s/g, "");
        return str;
    }
});

Vue.filter('convertCates', function (str) {
    if (str != null && str != "" & str != undefined) {
        var strCate = "";
        var strjson = JSON.parse(str);

        for (var i = 0; i < strjson.length; i++) {
            var item = strjson[i];
            var cate = item.third && item.third.id ? item.third : item.second && item.second.id ? item.second : item.first;
            if (cate.id)
                strCate += cate.name + "/";
        }
        return strCate;
    }

    return "";
});