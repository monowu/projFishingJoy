var game = null;

var background;
var LevelBar;
var EnergyBar;
var PlayFishes;
var Weapons;
var levelCount;
var counter;
var cannons;

var GamePlayView = cc.Node.extend({
    ctor: function () {
        this._super();

        game = this;
        SchedulerList.Game = this;
        Presenter.onScheduler(SchedulerList._forGame);
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
        var waves = new wavesLayer(From._game);
        this.addChild(waves);
        
        //bubble
        var bubbles = new bubblesLayer();
        this.addChild(bubbles);

        //LobbyFishes
        PlayFishes = new fishsLayer();
        this.addChild(PlayFishes);

        //weapon
        Weapons = new addWeapon();
        this.addChild(Weapons);

        //level bar
        LevelBar = new ccui.LoadingBar();
        LevelBar.loadTexture(res.Level_bar);
        LevelBar.setPercent(Parameters._levelpercent);
        LevelBar.setPosition(levelBarpos);
        this.addChild(LevelBar);

        var levelBg = cc.Sprite.create(res.LevelBg);
        levelBg.setPosition(levelBgpos);
        this.addChild(levelBg);

        levelCount = new levelLayer();
        levelCount.init(Parameters._level);
        this.addChild(levelCount);

        //bottom bar
        var bottomBar = cc.Sprite.create(res.Bottom_bar);
        bottomBar.setPosition(bottomBarpos);
        this.addChild(bottomBar);

        EnergyBar = new ccui.LoadingBar();
        EnergyBar.loadTexture(res.Energy_bar);
        EnergyBar.setPercent(Parameters._hit);
        EnergyBar.setPosition(energyBarpos);
        this.addChild(EnergyBar);
        
        counter = new counterLayer();
        counter.init(Parameters._totalCoins, 0, 1);
        this.addChild(counter);

        //attack
        cannons = new cannonsLayer();
        cannons.init();
        this.addChild(cannons);

        //menu
        var menu = new menuLayer(From._game);
        this.addChild(menu);

        //touch listener
        Presenter.addTouchListener();
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        //播放背景音樂
        if(isMusicPlay){
            Presenter.musicOn(From._game);
        }
    },
    onExit: function () {
        SchedulerList.Game.unscheduleUpdate();
        Presenter.offScheduler(SchedulerList._forGame);
        if(this.touchListener != null){
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener.release();
            this.touchListener = null;
        }
        SchedulerList.Game.removeAllChildren(true);
        this._super();
    },
    onExitTransitionDidStart: function () {
        //停止背景音樂
        Presenter.musicOff(From._game);
        this._super();
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var gamelayer = new GamePlayView();
        gamelayer.init();
        this.addChild(gamelayer);
    }
});