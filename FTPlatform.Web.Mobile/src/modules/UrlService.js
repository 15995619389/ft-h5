export var urls = {
    Demand: {
        List: '/Demand',
        Detail: '/Demand/Detail/'
    },
    Unique: {
        List: '/Unique/List/',
        Detial: '/Unique/Info',
        FTProduct: '/Unique/List/' + 1,
        DeptService: '/Unique/List/' + 2,
        CASATe: '/Unique/List/' + 3,
        IndustrySolve: '/Unique/List/' + 4,
        ArmyFuse: '/Unique/List/' + 5,
        IntellectualPro: '/Unique/List/' + 6,
        Aerospace: '/Unique/List/' + 7
    }
}

export function GetEncodedUrl() {
    var encodedUrl = encodeURIComponent(window.location.href)
    return encodedUrl
}

export function GetReturnUrl() {
    var reg = new RegExp('(^|&)returnurl=([^&]*)(&|$)')
    var s = window.location.search
    var r = s.substr(1).match(reg)
    if (r != null) {
        return decodeURIComponent(r[2])
    }
    return null
}

export function GetIdFromUrl() {
    var url = window.location.href
    var index = url.indexOf('?')
    if (index != -1) {
        url = url.substring(0, index)
    }
    var arr = url.split('/')
    var id = arr[arr.length - 1]
    if (!Number(id)) {
        return null
    }
    return id
}

export function GetParamUrl(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2]); return null
}
