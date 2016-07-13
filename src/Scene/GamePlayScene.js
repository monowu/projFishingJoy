var totalCoins = 10000;
var a_iCoin = 1;
var _time = 1;
var _interval = 1;
var _level = 1;
var _hit = 0;
var _levelpercent = 0;

var game = null;

var background;
var LevelBar;
var EnergyBar;
var PlayFishs;
var Weapons;
var levelCount;
var counter;
var cannons;

var backgroundLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        game = this;
        game.schedule(addPlayFishs, _interval, cc.REPEAT_FOREVER, _time);
        
    },
    init: function () {
        var centerpos = cc.p(size.width / 2, size.height / 2);
        var bottomBarpos = cc.p(size.width / 2 - 30, 42);
        var energyBarpos = cc.p(size.width - 222, 20);
        var levelBgpos = cc.p(165, size.height - 28);
        var levelBarpos = cc.p(200, size.height - 23);

        //background
        background = cc.Sprite.create(res.GameBg);
        background.setPosition(centerpos);
        this.addChild(background);

        // wave
        var waves = new wavesLayer(1);
        this.addChild(waves);
        
        //bubble
        var bubbles = new bubblesLayer();
        this.addChild(bubbles);

        //fishs
        PlayFishs = new fishsLayer();
        this.addChild(PlayFishs);

        //weapon
        Weapons = new addWeapon();
        this.addChild(Weapons);

        //level bar
        LevelBar = new ccui.LoadingBar();
        LevelBar.loadTexture(res.Level_bar);
        LevelBar.setPercent(_levelpercent);
        LevelBar.setPosition(levelBarpos);
        this.addChild(LevelBar);

        var levelBg = cc.Sprite.create(res.LevelBg);
        levelBg.setPosition(levelBgpos);
        this.addChild(levelBg);

        levelCount = new levelLayer();
        levelCount.init(_level);
        this.addChild(levelCount);

        //bottom bar
        var bottomBar = cc.Sprite.create(res.Bottom_bar);
        bottomBar.setPosition(bottomBarpos);
        this.addChild(bottomBar);

        EnergyBar = new ccui.LoadingBar();
        EnergyBar.loadTexture(res.Energy_bar);
        EnergyBar.setPercent(_hit);
        EnergyBar.setPosition(energyBarpos);
        this.addChild(EnergyBar);
        
        counter = new counterLayer();
        counter.init(totalCoins, 0, 1);
        this.addChild(counter);

        //attack
        cannons = new cannonsLayer();
        cannons.init();
        this.addChild(cannons);

        //menu
        var menu = new menuLayer(1);
        this.addChild(menu);

        //touch listener
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                //點擊範圍判斷
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    var touchPos = locationInNode;
                    if(isLighting){
                        Weapons.setVertex(touchPos);
                    }else {
                        cannons.updateRotation(touchPos);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.touchListener, background);
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        //播放背景音樂
        if(isMusicPlay){
            audioEngine.playMusic(res.Music_Game, true);
        }
    },
    onExit: function () {
        console.log("onExit play");
        game.unscheduleUpdate();
        game.unschedule(addPlayFishs);
        if(this.touchListener != null){
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener.release();
            this.touchListener = null;
        }
        game.removeAllChildren(true);
        this._super();
    },
    onExitTransitionDidStart: function () {
        this._super();
        //停止背景音樂
        audioEngine.stopMusic(res.Music_Game);
    }
});

var addPlayFishs = function () {
    _time += _interval;
    if(_time == 10){
        //金幣數量每10秒加 a_iCoin
        autoIncreaseCoins();
        dropCoins(1, cc.p(170, 80));
    }

    Picno = Math.floor(Math.random()*100);
    Side = Math.floor(Math.random()*2);
    State = 0;

    if (Picno < 90) {
        Picno = Math.floor(Picno/13) +1;
        Num = 15;
        Offset = 2;
    }else if (Picno < 98 && Picno >=90) {
        if (Picno == 90) Picno = 8;
        if (Picno == 91) Picno = 9;
        if (Picno == 94 || Picno == 95) Picno = 10;
        if (Picno == 96 || Picno == 97) Picno = 14;
        if (Picno == 92) Picno = 16;
        if (Picno == 93) Picno = 18;
        Num = 2;
        Offset = 1;
    }else{
        if(Picno == 99){
            Picno = 17;
        } else {
            Picno = 13;
        }
        Num = 0;
        Offset = 1;
    }
    PlayFishs.init(Picno, State, Side, Num, Offset);
};

var autoIncreaseCoins = function () {
    coinsCounter(a_iCoin, 0, 1);
    _time = 0;
};

var GamePlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var gamelayer = new backgroundLayer();
        gamelayer.init();
        this.addChild(gamelayer);
    }
});