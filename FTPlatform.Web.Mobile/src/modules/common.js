import Vue from 'vue'
import VueLazyload from 'vue-lazyload';

function GetParamUrl(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2]); return null
}

(function () {
    var sUserAgent = navigator.userAgent.toLowerCase()
    var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
    var bIsMidp = sUserAgent.match(/midp/i) == 'midp'
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
    var bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
    var bIsAndroid = sUserAgent.match(/android/i) == 'android'
    var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
    var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
    if (
        !(
            bIsIpad ||
            bIsIphoneOs ||
            bIsMidp ||
            bIsUc7 ||
            bIsUc ||
            bIsAndroid ||
            bIsCE ||
            bIsWM
        )
    ) {
        var host =
            window.location.host == 'm.techina2025.com'
                ? 'http://www.techina2025.com'
                : 'http://test.techina2025.com.cn'
        var pathname = window.location.pathname
        var reg1 = new RegExp('([^\\/]*)(\\/)([^\\/]*)(\\/)([^\\/]*)', 'ig')

        var result = reg1.exec(pathname)
        if (!result || result.length < 3) {
            window.location.href = host
            return
        }

        var mname = result[3] || 'home'
        var mcation = result[5] && result[5] == 'index' ? '' : result[5]
        var swkey = mname.toLowerCase()
        if (mcation) {
            var re = /^[0-9]+.?[0-9]*$/;
            if(re.test(mcation)){
                mcation = '1';
            }
            swkey += '/' + mcation.toLowerCase();

        }
        var gourl = ''
        switch (swkey) {
            case 'home':
            case 'passport/login':
            case 'passport/register':
            case 'search':
            case "act/ftsecondindex":
            case "act/decemberindex":
            case 'news':
                gourl = pathname
                break
            case 'demand':
                gourl = '/demand/list'
                break
            case 'demand/detail':
                gourl = pathname.replace(mcation, 'show')
                break
            case 'expert':
                gourl = '/expert/solutioncenterindex'
                break
            case 'expert/detail':
                gourl = pathname.replace(mcation, 'solutioncenterdetail')
                break
            case 'news/detail':
                gourl = pathname.replace(mcation, 'detailed')
                break
            case 'techshare':
                gourl = '/techshare/techindex'
                break
            case 'techshare/detail':
                gourl = pathname.replace(mcation, 'techdetail')
                break
            case 'unique':
            case 'unique/list':
                gourl = pathname.replace(mcation, 'techinque')
                break
            case 'unique/info':
                gourl = pathname.replace(mcation, 'productinfos')
                break
            case "patent/details":
                //gourl = pathname;
                gourl = pathname.replace(mname, 'TechShare')
                gourl = gourl.replace(mcation, 'patentinfo')
                break
            case "act/ftsuccess":
                gourl = pathname.replace(mcation, 'SuccessfulCases')
                break;
            case "act/decemberindex":
                gourl = '/act/decemberindex';
                break;
            case "activity/decemberindex":
                gourl = '/act/decemberindex';
                break;
            case "higharticle":
                gourl = '/high/higharticlehome';
                break;
            case "higharticlelist":
                //gourl = '/high/highArticleList';
                gourl = pathname.replace(mname, 'high/higharticlelist');
                var shopid = GetParamUrl('shopId');
                if(shopid){
                    gourl += '?merchantId=' + shopid;
                }

                //if (gourl.indexOf('shopId') >= 0)
                //    gourl.replace('shopId', 'merchantId');
                break;
            case "higharticle/1":
                gourl = pathname.replace(mname, 'high/higharticleshow')
                break;
            case "/act/labafestival":
            case "/activity/labadatail":
            case "/activity/labaindex":
                gourl = '/act/labafestival';
                break;
            default:
        }
        // console.log(gourl);
        window.location.href = host + gourl
    }
})()

$('body').on('touchmove', function (e) {
    if (!$('.l-scrollable').has($(e.target)).length) {
        e.preventDefault()
    }
})

Vue.use(VueLazyload, {
    error: '/Content/image/picloading.png',
    loading: '/Content/image/picloading.png',
    attempt: 1
})
