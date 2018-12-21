/*
    游戏入口
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('LudoGame', ['jquery', './game.map.core.js', './game.model.js'], factory)
    } else if (typeof exports === 'object') {
        module.exports = factory(require('juery'), require('./game.map.core.js'), require('./game.model.js'))
    } else {
        root.LudoGame = factory(root.jQuery, root.LudoGameMap, root.LudoGameModel)
    }
})(this, function ($, gmap, gmodel) {

    var game = function (opts) {

        if (!gmap || !gmap.MapView || !gmap.PersonView || !gmap.BlockView)
            throw 'LudoGameMap is not defined';

        if (!gmodel)
            throw 'LudoGameModel is not defined'

        this.gridList = [];
        this.personMap = {};//人物
        this.blockMap = {};//地图

        this.mapView = null;
        this.personView = null;
        this.blockView = null;
        this.extraView = null;
        this.sound = null;
        this.locked = true;
        this.isStart = true;

        this.init(opts);
    };

    /*
    初始化
    绘制地图、绘制可移动人物、
    */
    game.prototype.init = function (opts) {

        var width = window.innerWidth; 
        var heigth = window.innerHeight;
        width = $(".games_box").width();
        heigth = $(".games_box").height();

        this.mapView = new gmap.MapView(mapData, width, heigth, SCALE, 0, 0, opts.imageCache['map'], opts.imageCache['bg']);
        this.personView = new gmap.PersonView(this.mapView);
        this.blockView = new gmap.BlockView(this.mapView, opts.imageCache['map']);
        //this.extraView = new gmap.ExtraView();

        for (var i = 0; i < CONFIG.map.length; i++) {
            var item = CONFIG.map[i];
            var grid = new gmodel.GridModel(item.index, item.type, item);
            this.gridList.push(grid);
        }

        var players = [];
        players.push({ 'id': 1, 'balance': 50000, 'blockNumber': 3, index: 0 });
        if(opts.player){
            players.length = 0;
            players = opts.player;
        }

        for (var i = 0; i < players.length; i++) {
            var item = players[i];
            var player = new gmodel.PersonModel(item.id, item.index, item.balance, item.blockNumber);
            this.personMap[item.id] = player;
        }

        for (var i in this.personMap) {
            var person = this.personMap[i];
            this.mapView.draw();
            this.personView.init(person.id, person.index);
            //this.personView.mapElement_Width = width  / 4;
            //this.personView.mapElement_Height = heigth / 5;
            //this.mapElement_Width = 0;
            //this.mapElement_Height = 0;

            //extraView.addPerson(person.id);
            //this.extraView.setBalance(person.id, person.balance);
            //extraView.setBlockNumber(person.id, person.blockNumber);
            //this.extraView.unlock(person.id);
        }

        if (opts.sound && opts.sound.open) {
            var dom = null;
            var audiosrc = null;//'../audio/bg_music.mp3';
            if (opts.sound.audiodom)
                dom = opts.sound.audiodom;

            if (opts.sound.audiosrc)
                audiosrc = opts.sound.audiosrc;

            this.sound = new Sound(dom, audiosrc);
        }
    }

    /*
    移动
    */
    game.prototype.go = function (user, count, fn) {
        if (this.locked)
            return;
        this.lock();
        console.log(user, count);

        //if (count == 1 && this.isStart) {
        //    this.isStart = false;
        //    $(".role-image").css({ left: '15px;', top: '15px' });
        //    fn();
        //    return;
        //}

        var person = this.personMap[user];
        var index = (person.index + count) % this.gridList.length;
        //var blockIndex = checkBlock(user, index);
        var grid;

        this.personView.move(user, index);

        var self = this;
        setTimeout(function () {

            grid = self.gridList[index];
            person.index = index;

            //notice sieve set unlock
            if (typeof fn == 'function') {
                fn(grid);
            } 

            // if (grid.type == 'goStart') {
            //     // TODO: alert('NO EVENT HAPPENS');
            //     //extraView.unlock(user);
            //     //return;
            // }

            //extraView.unlock(user);
            //this.locked = false;

        }, 800 * count);
    }

    game.prototype.reload = function (index) {

        if (index != 13) {
            $('.role-image-start').hide();
        }

        for (var i in this.personMap) {
            var person = this.personMap[i];
            person.index = index;
            //this.mapView.draw();

            this.personView.roleList = {};
            this.personView.init(person.id, person.index);
        }
    }

    game.prototype.play = function () {
        this.sound.play();
    }

    game.prototype.pause = function () {
        this.sound.pause();
    }

    game.prototype.lock = function () {
        this.locked = true;
    }

    game.prototype.unlock = function () {
        this.locked = false;
    }


    /* 游戏声音 */
    var Sound = function (domId, src) {
        this.music = null;
        if (domId) {
            this.music = document.getElementById(domId || "bg_music");
        } else if (src) {
            var audio = document.createElement("audio");
            var audio_id = document.createAttribute('id');
            audio_id.nodeValue = 'bg_music';

            var audio_src = document.createAttribute('src');
            audio_src.nodeValue = src;

            var audio_loop = document.createAttribute('loop');

            audio.setAttributeNode(audio_id);
            audio.setAttributeNode(audio_src);
            audio.setAttributeNode(audio_loop);
            document.body.appendChild(audio);
            this.music = document.getElementById('bg_music');
        }
        else {
            this.music = document.getElementById(domId || "bg_music");
        }

        this.paused = this.music.paused;
    }
    Sound.prototype = {
        play: function (status) {
            this.music.play();
        },
        pause: function () {
            this.music.pause();
        }
    }

    return game;
});