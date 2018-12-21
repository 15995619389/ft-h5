
/*
游戏配置
map 游戏标注物
player 游戏玩家
*/
var CONFIG = {
    'map': [
        { 'index': 0, 'gift': 'demand', 'type': 'none', attr: { 'name': '技术需求库', 'des': '汇聚各行业海量技术需求难题，只等您来解决。' } },
        { 'index': 1, 'gift': '10_virCurrency', 'type': 'winning', attr: { 'name': '10枚智币', 'des': '恭喜获得10智币！' } },
        { 'index': 2, 'gift': 'expert', 'type': 'none', attr: { 'name': '技术资源库', 'des': '上万名各领域技术大咖，为您量身打造技术解决方案。' } },
        { 'index': 3, 'gift': '50_virCurrency', 'type': 'winning', attr: { 'name': '50枚智币', 'des': '恭喜获得50智币！' } },
        { 'index': 4, 'gift': 'cpmpanyService', 'type': 'none', attr: { 'name': '企业服务', 'des': '专业团队为您提供一站式企业服务方案，提升“专注度”与“竞争力”。' } },
        { 'index': 5, 'gift': '100_virCurrency', 'type': 'winning', attr: { 'name': '100枚智币', 'des': '恭喜获得100智币！' } },
        { 'index': 6, 'gift': 'unique', 'type': 'none', attr: { 'name': '众智绝活', 'des': '汇集中国航天高精尖技术，为您提供专业、顶级的技术服务。' } },
        { 'index': 7, 'gift': 'goStart', 'type': 'gostart', attr: { 'name': '回到起点', 'des': '很遗憾，您要回到起点重新进行游戏了' } },
        { 'index': 8, 'gift': 'mall', 'type': 'none', attr: { 'name': '智币商城', 'des': '智有所得，“币”有所想，好玩的小游戏、热门的高科技奖品，等你来兑换。' } },
        { 'index': 9, 'gift': 'iqiyi', 'type': 'winning', attr: { 'name': '爱奇艺VIP月度会员', 'des': '太幸运了！您获得爱奇艺VIP月度会员！请在2017年1月13日24:00前至“我的奖品”申请领取！逾期未申请领取视为作废。' } },
        { 'index': 10, 'gift': 'informationService', 'type': 'none', attr: { 'name': '知识产权服务', 'des': '海量数据库实现精准化匹配，让您的专利技术资源快速转化为商业价值。' } },
        { 'index': 11, 'gift': '30_virCurrency', 'type': 'winning', attr: { 'name': '30元话费', 'des': '恭喜获得30元话费！' } },
        { 'index': 12, 'gift': 'highProduct', 'type': 'none', attr: { 'name': '工业精品', 'des': '中国航天工业精品的在线采购商城，来自航天，品质保证。' } },
        { 'index': 13, 'gift': 'mobile', 'type': 'winning', attr: { 'name': 'iPhone X', 'des': '恭喜您获得iPhone X一台！' } } // 恭喜您获得iPhone X一台！
    ],
    'player': [
        { 'id': 1, 'balance': 50000, 'blockNumber': 3, index: 0 },
        //{'id':2, 'balance':50000, 'blockNumber': 3, index: 10},
        // {'id':3, 'balance':50000, 'blockNumber': 3, index: 2},
        // {'id':4, 'balance':50000, 'blockNumber': 3, index: 3},
        // {'id':5, 'balance':50000, 'blockNumber': 3, index: 4},
        // {'id':6, 'balance':50000, 'blockNumber': 3, index: 5},
        // {'id':7, 'balance':50000, 'blockNumber': 3, index: 6},
        // {'id':8, 'balance':50000, 'blockNumber': 3, index: 7},
        // {'id':9, 'balance':50000, 'blockNumber': 3, index: 8},
        // {'id':10, 'balance':50000, 'blockNumber': 3, index: 9},
        // {'id':11, 'balance':50000, 'blockNumber': 3, index: 10},
        // {'id':12, 'balance':50000, 'blockNumber': 3, index: 11},
        // {'id':13, 'balance':50000, 'blockNumber': 3, index: 12},
    ],
    'timeout_seconds': 15
}

//图片加载函数,  callback为当所有图片加载完毕后的回调函数.
// var loadImage = function (imagesList, callback) {
//     var images = {};
//     var num = imagesList.length;
//     var i = 0;
//     setImage();
//     function setImage() {
//         if (i < num) {
//             var img = imagesList[i];
//             images[img.id] = new Image();
//             images[img.id].src = img.url;
//             images[img.id].onload = function (event) {
//                 i++;
//                 setImage();
//             }
//         }
//         else {
//             if (typeof callback == "function") {
//                 callback.apply(this, arguments);
//             }
//         }
//     }
//     return images;

// }


var loadImage = function (imagesList, callback) {
    var images = {};
    var map = [];
    var num = imagesList.length;
    var i = 0;

    var mapNum = 0;
    var j = 0;
    setImage();
    function setImage() {
        if (i < num) {
            var img = imagesList[i];
            if (img && img.map) {
                mapNum = img.map.length;
                if (j >= mapNum) {
                    i++;
                    setImage();
                    //return;
                }
                else {

                    img = img.map[j];
                    var item = new Image();
                    item.src = img;
                    item.onload = function (event) {
                        j++;
                        setImage();
                    }
                    map.push(item);
                }
            }
            else {
                images[img.id] = new Image();
                images[img.id].src = img.url;
                images[img.id].onload = function (event) {
                    i++;
                    setImage();
                }
            }
        }
        else {
            if (typeof callback == "function") {
                callback.apply(this, arguments);
            }
        }
    }

    images.map = map;
    return images;

}