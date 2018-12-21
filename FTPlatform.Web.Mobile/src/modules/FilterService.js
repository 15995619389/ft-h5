(function (root, facotry) {
    if (typeof define === 'function' && define.amd) {
        define('FilterService', [], facotry)
    } else if (typeof exports === 'object') {
        module.exports = facotry()
    } else {
        root.FilterService = facotry()
    }
}(this, function () {
    return {
        filters: {
            html: function (str) {
                if (str != null && str != '' & str != undefined) {
                    str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
                    str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
                    // str = str.replace(/\n[\s| | ]*\r/g,'\n'); // 去除多余空行
                    str = str.replace(/ /ig, '') // 去掉
                    str = str.replace(/&nbsp;/ig, '')
                    str = str.replace(/\s/g, '')
                    return str
                }
            },
            isCheckUser: function (value) {
                if (value != null) {
                    return value.AvatarUrl
                }
            },
            formatLength: function (value, len, str) {
                if (value != null && value != '') {
                    if (value.length < len) {
                        return value
                    } else {
                        if (str) {
                            return value.substr(0, len) + str
                        } else {
                            return value.substr(0, len) + '...'
                        }
                    }
                }
            },
            formatDate: function (value, len) {
                if (value != null && value != '') {
                    if (len) {
                        return value.substring(0, len)
                    } else {
                        return value.substring(0, 10)
                    }
                }
            }
        }
    }
}))
