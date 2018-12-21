
var mapData = [
    [20, 20, 20, 20],
    [20, -1, -1, 20],
    [20, -1, -1, 20],
    [20, -1, -1, 20],
    [20, 20, 20, 20],
]

//地图数据 4-5 0-4是房子信息,20是标志位
var H5MapData = [
    [20, 20, 20, 20],
    [20, -1, -1, 20],
    [20, -1, -1, 20],
    [20, -1, -1, 20],
    [20, 20, 20, 20],
];

//地图数据 5-4
var PCMapData = [
    [20, 20, 20, 20, 20],
    [20, -1, -1, -1, 20],
    [20, -1, -1, -1, 20],
    [20, 20, 20, 20, 20],
];

//图片对象
// var IMAGE_LIST=[ 
// 	{
// 		id:"bg",
// 		url:"images/bg.gif"
// 	},
// 	{
// 		id : "map",
// 		url : "images/map.png"
// 	}
// ];
var IMAGE_LIST = [
    {
        id: "bg",
        url: "/content/image/activity/201712/body_bg.png"
    },
    {
        map: [
            "/content/image/activity/201712/map_demand.png",
            "/content/image/activity/201712/map_ten.png",
            "/content/image/activity/201712/map_resources.png",
            "/content/image/activity/201712/map_fifty.png",

            "/content/image/activity/201712/map_iphoneX.png",
            "/content/image/activity/201712/map_act.png",

            "/content/image/activity/201712/map_high.png",
            "/content/image/activity/201712/map_100.png",
            // "",
            // "",
            "/content/image/activity/201712/map_30.png",
            "/content/image/activity/201712/map_zz.png",
            // "",
            // "",
            "/content/image/activity/201712/map_knowledge.png",
            "/content/image/activity/201712/map_vip.png",
            "/content/image/activity/201712/map_shop.png",
            "/content/image/activity/201712/map_home.png",
            
        ]
    }
];

//放大倍数
var SCALE = 1;

//存放已载入的图片
var imageCache = null;

//地图坐标偏移量
var offsetX;
var offsetY;
