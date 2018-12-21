(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('LudoGameMap', ['jquery'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(require('juery'))
    } else {
        root.LudoGameMap = factory(root.jQuery)
    }
})(this, function ($) {

    //地图类
    var MapView = function (mapDataArray, width, height, scale, offsetX, offsetY, image, bgImage) {
        this.mapDataArray = mapDataArray;
        this.scale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.image = image;
        this.widthNum = mapDataArray[0].length;//地图宽的元素数量
        this.heightNum = mapDataArray.length;//地图高的元素数量

        this.width = width - 10;//绘制的地图宽度
        this.height = height;//绘制的地图高度

        this.sw = 172;//绘制出的图像宽度
        this.sh = 141;//绘制出的图像高度	

        this.rows = 4;
        this.columns = 5;

        this.height = (this.sh * this.scale) * 5;
        this.init = function () {
            //if (bgImage) {
            //    this.drawBgByImage(bgImage);
            //}

            if(this.mapDataArray && this.mapDataArray.length > 0){
                this.rows = this.mapDataArray.length;
                this.columns = this.mapDataArray[0].length;                
            }

            // 创建canvas，并初始化 （也可以直接以标签形式写在页面中，然后通过id等方式取得canvas）
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width * 2;
            this.canvas.height = height * 2;

            this.canvas.style.width = this.width + "px";
            this.canvas.style.height = height - 10 + "px";
            //document.body.appendChild(this.canvas);
            document.getElementById("games_box").appendChild(this.canvas);

            // 取得2d绘图上下文 
            this.context = this.canvas.getContext("2d");
            this.color = '#000000';

            var mapElementArray = new Array();

            var dw = (this.width * 2) / 4;//this.sw * this.scale; //((this.width / this.columns))  //* this.scale; //this.sw * this.scale;//绘制出的图像宽度
            var dh = (height * 2) / 5 //this.sh * this.scale;//绘制出的图像高度	
            var n = 0;
            for (var i = 0; i < this.heightNum; i++) {
                var tempArray = new Array(0);
                for (var j = 0; j < this.widthNum; j++) {
                    var flag = this.mapDataArray[i][j];
                    var dx = this.offsetX + j * dw;
                    var dy = this.offsetY + i * dh;
                    //var dx =  j * dw;
                    //var dy =  i * dh;
                    //console.log('flag:'+flag+'owner:'+owner+'|sx:'+sx+'|sy:'+sy+'|sw:'+sw+'|sh:'+sh+'|dx:'+dx+'|dy:'+dy+'|scale:'+this.scale+'|image:'+this.image+'|context:'+this.context+'|color:'+this.color);
                    tempArray[j] = new MapElement(flag, dx, dy, this.scale, this.image[n], this.context, this.color);
                    tempArray[j].dw = dw;
                    tempArray[j].dh = dh;
                    tempArray[j].sjw = this.width / 4;
                    tempArray[j].sjh = height / 5;
                    if(flag == 20){ n ++;}
                }
                mapElementArray[i] = tempArray;
            }

            this.mapElementArray = mapElementArray;

        }

        this.getijByIndex = function (index) {
            /*if (index >= 1 && index <= 2) {
                var i = 0;
                var j = index + 1;
                return { 'i': i, 'j': j }
            }
            else if (index >= 4 && index <= 6) {
                var i = index - 2;
                var j = 5;
                return { 'i': i, 'j': j }
            }
            else if (index >= 8 && index <= 9) {
                var i = 6;
                var j = 11 - index;
                return { 'i': i, 'j': j }
            }
            else if (index >= 11 && index <= 13) {
                var j = 0;
                var i = 15 - index;
                return { 'i': i, 'j': j }
            }*/
        };

        this.draw = function () {
            for (var i = 0; i < this.heightNum; i++) {
                for (var j = 0; j < this.widthNum; j++) {
                    var element = this.mapElementArray[i][j];
                    element.draw();
                }
            }
        };

        this.drawByIndex = function (index) {
            var temp = this.getijByIndex(index);
            if (temp) {
                var i = temp.i;
                var j = temp.j;
                this.mapElementArray[i][j].draw();
            }
        };

        this.drawBgByImage = function (bgImage) {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            document.body.appendChild(canvas);
            var context = canvas.getContext("2d");
            context.drawImage(bgImage, 0, 0, this.width, this.height);
        };

        this.cleanByColorByIndex = function (index) {
            var temp = this.getijByIndex(index);
            var i = temp.i;
            var j = temp.j;
            this.mapElementArray[i][j].cleanByColor();
        };

        this.setMap = function (index, flag, owner) {
            //console.log(index, flag, owner);

            var temp = this.getijByIndex(index);
            if (temp) {
                var i = temp.i;
                var j = temp.j;
                this.mapElementArray[i][j].setFlag(flag);

                if (owner) {
                    this.mapElementArray[i][j].setOwner(owner);
                }
            };
        };

        // this.getMapByIndex = function (index) {
        //     var temp = this.getijByIndex(index);
        //     if (temp) {
        //         var m = temp.i;
        //         var n = temp.j;
        //         var flag = this.mapElementArray[m][n].getFlag();
        //         var owner = this.mapElementArray[m][n].getOwner();
        //     };
        //     var i; var j;
        //     if (index >= 0 && index <= 4) {
        //         i = 0; j = index;
        //     } else if (index >= 5 && index <= 7) {
        //         i = index - 4; j = 4;
        //     } else if (index >= 8 && index <= 11) {
        //         i = 3; j = 11 - index;
        //     } else if (index >= 12 && index <= 13) {
        //         j = 0; i = 14 - index;
        //     }
        //     var x = this.mapElementArray[i][j].dx;
        //     var y = this.mapElementArray[i][j].dy;
        //     return { 'flag': flag, 'owner': owner, 'x': x, 'y': y };
        // };

        this.getMapByIndex = function (index) {
            var temp = this.getijByIndex(index);
            if (temp) {
                var m = temp.i;
                var n = temp.j;
                var flag = this.mapElementArray[m][n].getFlag();
                var owner = this.mapElementArray[m][n].getOwner();
            };

            var i; var j;
            if (index >= 0 && index <= (this.columns-1)) {
                i = 0; j = index;
            } else if (index >= this.columns && index <= ((this.columns - 1) + this.rows - 1)) {
                i = index - (this.columns-1); j = (this.columns - 1);
            } else if (index >= ((this.columns - 1) + this.rows) && index <= ((this.columns-1)*2 + (this.rows - 1))) {
                i = this.rows - 1; j = ((this.columns-1)*2 + (this.rows - 1)) - index;
            } else if (index >= ((this.columns-1)*2 + (this.rows - 1)) && index <= ((this.columns-1)*2 + (this.rows-1)*2)-1) {
                j = 0; i = ((this.columns-1)*2 + (this.rows-1)*2) - index;
            }
            var x = this.mapElementArray[i][j].dx;
            var y = this.mapElementArray[i][j].dy;
            var width = this.mapElementArray[i][j].sjw;
            var height = this.mapElementArray[i][j].sjh;
            return { 'flag': flag, 'owner': owner, 'x': x, 'y': y, 'width': width, 'height': height };
        };

        this.init();
    };

    //地图元素类
    function MapElement(flag, dx, dy, scale, image, context, bgcolor) {
        this.flag = flag;//元素的策略标记，根据此标记逻辑层可以有自身的策略
        this.owner = 0;//这个位置子属于谁
        this.sx = 0;//当前元素在素材中的x坐标
        this.sy = 200;//当前元素在素材中的y坐标
        this.sw = 172;//当前元素在素材中的宽度
        this.sh = 141;//当前元素在素材中的高度
        this.dx = dx;//当前元素绘制在图像中的x坐标
        this.dy = dy;//当前元素绘制在图像中的y坐标
        this.scale = scale;//放大的倍数
        this.dw = this.sw * 0.48;//绘制出的图像宽度
        this.dh = this.sh * 0.48;//绘制出的图像高度
        this.image = image;//绘制的素材
        this.context = context;//绘制的canvas的context
        this.bgcolor = bgcolor;//默认擦除的颜色

        this.sjw = this.dx;
        this.sjh = this.dh;

        this.cleanByColor = function () {
            this.context.fillStyle = this.bgcolor;
            this.context.fillRect(this.dx, this.dy, this.dw, this.dh);
        };

        this.draw = function () {
            switch (this.flag) {
                case -1:
                    this.sx = 0;
                    this.sy = 172;
                    break;
                case 0:
                    if (parseInt(this.owner)) {
                        this.sx = 400;
                        this.sy = 0;
                    } else {
                        this.sx = 100;
                        this.sy = 0;
                    }
                    break;
                case 1:
                    this.sx = 200;
                    this.sy = 0;
                    break;
                case 2:
                    this.sx = 500;
                    this.sy = 0;
                    break;
                case 3:
                    this.sx = 300;
                    this.sy = 100;
                    break;
                case 20:
                    this.sx = 0;
                    this.sy = 0;
                    break;
            }
            //console.log('image:'+this.image+'|sx:'+this.sx+'|sy:'+this.sy+'|sw:'+this.sw+'|sh:'+this.sh+'|dx:'+this.dx+'|dy:'+this.dy+'|dw:'+this.dw+'|dh:'+this.dh);
            try{
                if(this.image)
                    this.context.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
            }
            catch(e){ 
                console.log(e) 
            }
            finally{}
        };

        this.setFlag = function (flag) {
            this.flag = flag;
        };

        this.getFlag = function () {
            return this.flag;
        };

        this.setOwner = function (owner) {
            this.owner = owner;
        };

        this.getOwner = function () {
            return this.owner;
        }

        this.setPosition = function (dx, dy) {
            this.dx;
            this.dy;
        };

        this.getPosition = function (dx, dy) {
            return { 'x': this.dx, 'y': this.dy }
        };
    };

    function BlockBase(image, container) {

        //基本属性
        this.type = 'blocker';
        this.image = image;
        this.container = container;

        this.scale = SCALE;

        console.log(this.container);

        this._init();
    }

    /**
     ** 初始化用户头像节点，并插入DOM
     **/
    BlockBase.prototype._init = function (position) {

        var _width = 100 * this.scale;

        this.blockImage = $('<canvas width="' + _width + '" height="' + _width + '"></canvas>').appendTo(this.container);

        /*
        this.blockImage.css({
            width:100 * this.scale,
            height:100 * this.scale
        })
        */

        /*
        this.blockImage=document.createElement("canvas");
        this.blockImage.width=this.width;
        this.blockImage.height=this.height;
        this.container.append(this.blockImage);
        */

        this.context = this.blockImage[0].getContext("2d");

        console.log(this.image, 100 * this.scale);
        this.context.drawImage(this.image, 300, 0, 100, 100, 3, 0, _width, _width);
    }

    /**
     ** 设置用户头像位置
     **/
    BlockBase.prototype.setPosition = function (position) {

        this.blockImage.css({
            visibility: "visible",
            opacity: 0,
            left: position.x + "px",
            top: position.y + "px"
        }).animate({
            opacity: 1
        }, 500);
    }

    /**
     ** 移除路障
     **/
    BlockBase.prototype.remove = function () {

        console.log(this.blockImage);
        this.blockImage.fadeOut(function () {
            $(this).remove();
        });
    }



    function BlockView(mapView, image) {
        this.blockerMap = {};
        this.image = image;
        this.mapView = mapView;
        this.container = $('<div class="block-viewer"></div>').appendTo('body');
    }

    /**
     ** 初始化一个用户角色，并设置坐标位置
     **/
    BlockView.prototype.add = function (mapIndex) {

        var blocker,
            position;

        blocker = new BlockBase(this.image, this.container);

        position = this.mapView.getMapByIndex(mapIndex);
        blocker.setPosition(position);

        this.blockerMap[mapIndex] = blocker;
    };

    /**
     ** 移除一个block
     **/
    BlockView.prototype.remove = function (mapIndex) {

        var blocker,
            position;

        blocker = this.blockerMap[mapIndex];

        blocker && blocker.remove();

        this.blockerMap[mapIndex] = null;

    };


    /*
    人物
    */
    if (!window.CONFIG) {
        CONFIG = {};
    }

    //CONFIG.gridSize = 100 * SCALE;
    CONFIG.gridSize = 174 * SCALE;
    CONFIG.roleSize = 50;

    //计算头像的偏移值
    var roleOffsetX = (CONFIG.roleSize - CONFIG.gridSize) / 2;
    var roleOffsetY = CONFIG.roleSize - CONFIG.gridSize + 20;

    var roleIndex = 1;

    function RoleBase(offset) {

        //基本属性
        this.name = "";
        this.age = 10;

        //人物特殊特性
        this.talent = 10;
        this.lucky = 20;


        //人物装备
        this.props = [];

        //行动方向
        this.flage = 'right';

        this._init();

        this.left = 0;
        this.top = 0;

        this.initposition = {};
    };

    /**
     ** 初始化用户头像节点，并插入DOM
     **/
    RoleBase.prototype._init = function (position) {
        // document.body.appendChild('<div id="roleImage" class="role-image" style="background:url(images/role0' + roleIndex + '.png) no-repeat 0 0;"></div>');
        // this.roleImage = document.getElementById('roleImage');

        //this.roleImage = $('<div class="role-image" style="background:url(images/role0' + roleIndex + '.png) no-repeat 0 0;"></div>');

        if (this.roleImage)
            this.roleImage.remove();

        $(".role-image").remove();

        this.roleImage = $('<div class="role-image"></div>');
        this.roleChangImage = $('<image src="/content/image/activity/201712/move/right-0.png" />').appendTo(this.roleImage);
        //this.roleImage.appendTo('body');
        this.roleImage.appendTo('#games_box');

        roleIndex++;
    };

    /**
     ** 设置用户位置索引，以便计算
     **/
    RoleBase.prototype.setPosIndex = function (mapIndex) {
        this.posIndex = mapIndex;
    };

    /**
     ** 设置用户头像位置
     **/
    RoleBase.prototype.setPosition = function (position) {
        this.left = parseInt(position.x / 2 + 25);// - roleOffsetX);
        this.top = parseInt(position.y / 2 + 10);// - roleOffsetY);

        this.roleImage.css({
            //left: (position.x / 2 - roleOffsetX) + "px",
            //top: (position.y / 2 - roleOffsetY) + "px"
            left: (position.x / 2 + 25) + "px",
            top: (position.y / 2 + 10) + "px"

        });
    };

    RoleBase.prototype.setFlage = function (position, prePosition) {

        if (prePosition == null)
            return this.flage;

        if (prePosition.x > position.x && prePosition.y == position.y) {
            this.flage = 'left';
        } else if (prePosition.x < position.x && prePosition.y == position.y) {
            this.flage = 'right';
        } else if (prePosition.x == position.x && prePosition.y < position.y) {
            this.flage = 'down';
        } else if (prePosition.x == position.x && prePosition.y > position.y) {
            this.flage = 'up';
        }

    };

    RoleBase.prototype.setFlagex = function (index) {

        if (index == 13)
            return this.flage;

        if (index >= 0 && index <= 3) {
            this.flage = 'right';
        } else if (index >= 4 && index <= 7) {
            this.flage = 'down';
        } else if (index >= 8 && index <= 10) {
            this.flage = 'left';
        } else if (index >= 11 && index <= 13) {
            this.flage = 'up';
        }

        //var rolepath = '/content/image/activity/201712/move/' + this.flage + '-0.png';
        //this.roleChangImage.attr('src', rolepath);

    };

    /**
     ** 设置用户头像位置
     **/

    RoleBase.prototype.setPositionNew = function (position, i) {

        var lleft = parseInt(this.roleImage.css("left"));
        var ltop = parseInt(this.roleImage.css("top"));
        this.left = lleft;
        var testle = { x: lleft, y: ltop };
        this.setFlage(position, testle);
        this.initDirection();

        //clearInterval(clc);
        var self = this;
        // clc = setInterval(function(){ 
        //     i++; 
        //     self.Test(position)
        // }, 100);

        var clc = null;

        //for (var j = 0; j < 4; j++) {
        (function () {
            clc = setInterval(function () {
                if (i >= 8) {
                    clearInterval(clc);
                    //self.initDirection();
                    i = 0;
                    return;
                }

                i++;
                self.Test(position, i);
                //console.log("1:"+ self.roleImage.css("background-image"));
            }, 100);
        })();
        //}
    };

    RoleBase.prototype.initDirection = function () {
        var rolepath = '/content/image/activity/201712/move/' + this.flage + '-0.png';
        this.roleChangImage.attr('src', rolepath);

        if (this.flage == "down" || this.flage == "up") {
            this.roleChangImage.css({
                width:"auto",
                height: "50px",
            });
        }else{
            this.roleChangImage.css({
                width:"50px",
                height: "auto",
            });

        }
        // // var name = "url(images/move/'+this.flage+'-0.png)";
        // this.roleImage.css({
        //     'background-image': rolepath,
        //     //left: (position.x - roleOffsetX) + "px",
        //     //top: (position.y - roleOffsetY) + "px"
        // });
    }


    RoleBase.prototype.Test = function (position, i) {
        var x = i % 4;
        var imgpath = "url(/content/image/activity/201712/move/" + this.flage + "-" + x + ".png)";
        switch (this.flage) {
            case "left":
                this.left -= position.width / 8;
                this.top = (position.y / 2) + 15;//- roleOffsetY;
                break;
            case "right":
                this.left += position.width / 8;
                this.top = (position.y / 2) + 15;// - roleOffsetY;
                break;
            case "down":
                this.left = (position.x / 2) + 20;// - roleOffsetX;
                this.top += (position.height / 8) - 1;
                break;
            case "up":
                this.left = (position.x / 2) + 20;// - roleOffsetX;
                this.top -= position.height / 8;
                break;
        }

        //console.log(this.left +  '  ' + this.top);

        this.roleChangImage.attr('src', "/content/image/activity/201712/move/" + this.flage + "-" + x + ".png");
        this.roleImage.css({
            //'background-image': name,
            // left: testx + "px",
            // top: testy + "px"
            left: (this.left) + "px",
            top: (this.top) + "px"

        });
    }

    function PersonView(mapView) {

        //错位位移
        this.offsetx = 0;

        //用户角色实例列表
        this.roleList = {};

        this.mapView = mapView;
    }

    /**
     ** 初始化一个用户角色，并设置坐标位置
     **/
    PersonView.prototype.init = function (userId, mapIndex) {

        var role,
            position;

        if (!this.roleList[userId]) {
            this.roleList[userId] = new RoleBase();
        }
        role = this.roleList[userId];
        position = this.mapView.getMapByIndex(mapIndex);

        if (this._checkPositionDouble(userId, mapIndex) === true) {
            position.x = position.x - this.offsetx;
        }
        //role.initposition = position;
        role.setPosIndex(mapIndex);
        role.setPosition(position);

        if (mapIndex == 13) {
            role.flage = 'right';
            role.roleImage.css({
                left: "-90px",
                top: 15 + "px"

            });
        } else {
            role.setFlagex(mapIndex);
            role.initDirection();

            role.initposition = position;
        }
    };

    /**
     ** 检查某坐标点是否有
     **/
    PersonView.prototype._checkPositionDouble = function (userId, mapIndex) {

        var role,
            position;

        for (var roleId in this.roleList) {
            if (roleId !== userId) {
                role = this.roleList[roleId];
                console.log(parseInt(role.posIndex, 10) === parseInt(mapIndex, 10))
                if (parseInt(role.posIndex, 10) === parseInt(mapIndex, 10)) {
                    return true;
                }
            }
        }

        return false;
    };


    /**
     ** 移动角色到某个位置
     **/
    PersonView.prototype.move = function (userId, mapIndex) {

        var mapPositionArr = [],
            role = this.roleList[userId],
            Map = this.mapView,
            posIndex,
            position;

        if (!role) {
            console.log('不存在该用户角色');
        }

        posIndex = role.posIndex;

        if ((mapIndex < posIndex) && (posIndex - mapIndex) < 4) {
            console.log('位置信息不正确');
        }

        //mapIndex = mapIndex - 1;
        role.setPosIndex(mapIndex);


        //计算用户头像移动路径坐标数组
        if (mapIndex > posIndex) {
            var i = posIndex + 1;
            for (; i <= mapIndex; i++) {
                mapPositionArr.push(Map.getMapByIndex(i));
            }
        } else {
            for (var j = (posIndex + 1); j <= 13; j++) {
                mapPositionArr.push(Map.getMapByIndex(j));
            }
            for (var k = 0; k <= mapIndex; k++) {
                mapPositionArr.push(Map.getMapByIndex(k));
            }
        }

        if (this._checkPositionDouble(userId, mapIndex) === true) {
            mapPositionArr[mapPositionArr.length - 1].x = mapPositionArr[mapPositionArr.length - 1].x - this.offsetx;
        }

        //让用户头像按路径位置移动
        for (var p = 0; p < mapPositionArr.length; p++) {

            (function (arrIndex, position) {

                var i = 0;
                setTimeout(function () {
                    //role.setPosition(position);

                    role.setFlage(position, role.initposition);
                    role.setPositionNew(position, i);
                    role.initposition = position;

                }, arrIndex * 800);
            })(p, mapPositionArr[p]);

            //定时设置用户头像位置，保证动画进行
            // (function (arrIndex, position) {

            //     setTimeout(function () {
            //         //role.setPosition(position);
            //         role.setPositionNew(position);
            //     }, arrIndex * 250);
            // })(p, mapPositionArr[p]);

        }
    };

    /*
    
    */

    return {
        MapView: MapView,
        MapElement: MapElement,
        BlockView: BlockView,
        PersonView: PersonView,
        //ExtraView: ExtraView
    }

});