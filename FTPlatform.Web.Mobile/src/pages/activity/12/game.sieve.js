/*
    游戏元素：筛子
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('Sieve', ['jquery'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(require('juery'))
    } else {
        root.Sieve = factory(root.jQuery)
    }
})(this, function ($) {

    var sieve = function (opts) {
        this.container = null;
        //this.game = null;
        this.startX = 0, this.startY = 0;
        // this.speedX = 50, this.speedY = 50;
        this.x = 0, this.y = 0;
        this.ring = 3;
        this.callback = null;
        this.pers = 2000;
        this.digit = 0;
        this.locked = false;

        this.init(opts);
    }

    sieve.prototype.init = function (opts) {
        var options = {
            container: this.container,
            startX: this.startX,
            startY: this.startY,
            ring: this.ring,
            fn: null
        }

        $.extend(options, opts);
        this.ring = options.ring;
        this.container = options.container;
        this.startX = options.startX;
        this.startY = options.startY;
        this.callback = options.fn;
        

        if (this.container == null)
            throw "container is not defined";

        if (this.ring <= 0)
            throw "ring is not be less than 0 ";

        if (!this.startX && !this.startY) {
            this.startX = this.container.offsetLeft;
            this.startY = this.container.offsetTop;

            //this.x = this.startX + (this.startX / 5);
            //this.y = this.startY + (this.startY / 5);

            //console.log(this.x + "  " + this.y);
            //speedX = startX * 3;
            //speedY = startY * 3;
        }

        this.container.timer = null;
    }

    sieve.prototype.computeLES = function(digit){
        var x = this.x, y = this.y;
        //var item_x = Math.abs(x)/360;
        if(digit == 1){
            x = Math.abs(360 - (Math.abs(x)%360));
            y = Math.abs(360 - (Math.abs(y)%360));

        }else if (digit == 2){
            x = Math.abs(360 - (Math.abs(x)%360));
            y = Math.abs(270 - (Math.abs(y)%270));


        }else if (digit == 3){
            x = Math.abs(360 - (Math.abs(x)%360));
            y = Math.abs(180 - (Math.abs(y)%180));

            //  x = 1825;
            //  y = 901;
        }else if (digit ==4){
            x = Math.abs(360 - (Math.abs(x)%360));
            y = Math.abs(90 - (Math.abs(y)%90));

        }else if (digit ==5){
            x = Math.abs(90 - (Math.abs(x)%90));
            y = Math.abs(360 - (Math.abs(y)%360));

            //x = 171;
            //y = 480;
    
        }else if (digit == 6){
            x = Math.abs(270 - (Math.abs(x)%270));
            y = Math.abs(360 - (Math.abs(y)%360));

        }

        console.log(x +" " + y);
        // var index = 0
        // var total= x;
        // while(true){
        //     var total =  (total * 0.95);  
        //     if(Math.abs(total) <= 0.1)
        //         break;

        //     index ++  ;  
        // }

        // var sx = nixiang(index, x);

        // total= y;
        // while(true){
        //     var total =  (total * 0.95);  
        //     if(Math.abs(total) <= 0.1)
        //         break;

        //     index ++  ;  
        // }

        // var sy = nixiang(index, y);

        this.speedX = x / 5;
        this.speedY = y / 5;

        this.x = x;
        this.y = y;
    }

    sieve.prototype.transform = function (elem, value, key) {
        key = key || "transform";

        ["-webkit-", "-moz-", "-ms-", "-o-", ""].forEach(function () {
            elem.style[key] = value;
        });

        return elem;
    }

    sieve.prototype.startMove = function (digit, fn) {
        if(this.locked)
            return;
        this.lock();
        this.callback == fn || this.callback;
        this.container.timer = this.container.timer || null;
        clearInterval(this.container.timer);

        this.digit = digit;
        this.speedX = 0,this.speedY = 0;
        this.x = 0, this.y = 0;        
        this.computeLES(digit);

        var self = this;
        container.timer = setInterval(function () {
            self.x += self.speedX;
            self.y += self.speedY;

            self.speedY *= 0.95;
            self.speedX *= 0.95;
            //console.log(self.speedX + "  " + self.speedY + "  x:" + self.x + " y:" + self.y);
            if (Math.abs(self.speedX) < 0.1 && Math.abs(self.speedY) < 0.1) {
                self.stopMove(self.container.timer);
            };

            // self.x += 36.928;
            self.transform(self.container, "perspective(" + self.pers + "px) rotateX(" + self.x + "deg) rotateY(" + self.y + "deg)");

        }, 30);

    }

    sieve.prototype.stopMove = function () {
        clearInterval(this.container.timer);
        if(this.callback && typeof this.callback == "function"){
            this.callback(this.digit);
        }
    }

    sieve.prototype.lock = function(){
        this.locked = true;
    }

    sieve.prototype.unlock = function(){
        this.locked = false;
    }

    return sieve;

});