//宣告一個Presenter
var Presenter = new Presenter();

//聲音設定
var audioEngine = cc.audioEngine;
var isMusicPlay = true;
var isEffectPlay = true;

var size = cc.winSize;

var LobbyFishes;

var LobbyView = cc.Node.extend({
    ctor: function () {
        this._super();
        
        SchedulerList.Lobby = this;
        Presenter.onScheduler(SchedulerList._forLobby);
    },
    init: function () {
        this._super();
        
        //background
        var staBackground = new cc.Sprite(res.StartBg);
        this.addChild(staBackground);
        var centerpos = cc.p(size.width/2, size.height/2);
        staBackground.setPosition(centerpos);

        // wave
        var waves = new wavesLayer(From._lobby);
        this.addChild(waves);

        //fish
        LobbyFishes = new fishsLayer();
        this.addChild(LobbyFishes);

        //bubble
        var bubbles = new bubblesLayer();
        this.addChild(bubbles);

        //title
        var sparktitle = new titleLayer();
        sparktitle.init();
        this.addChild(sparktitle);

        //menu
        var menu = new menuLayer(From._lobby);
        this.addChild(menu);
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        //播放背景音樂
        Presenter.musicOn(From._lobby);
    },
    onExit: function () {
        SchedulerList.Lobby.unscheduleUpdate();
        Presenter.offScheduler(SchedulerList._forLobby);
        SchedulerList.Lobby.removeAllChildren(true);
        this._super();
    },
    onExitTransitionDidStart: function () {
        //停止背景音樂
        Presenter.musicOff(From._lobby);
        this._super();
    }
});
var LobbyScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var lobby = new LobbyView();
        lobby.init();
        this.addChild(lobby);
    }
});