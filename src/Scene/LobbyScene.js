var audioEngine = cc.audioEngine;
var isMusicPlay = true;
var isEffectPlay = true;

var size = cc.winSize;

var lobby = null;
var fishs;

var Picno;
var State;
var Side;
var Num;
var Offset;

var lobbyLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        lobby = this;
        lobby.schedule(this.addFishs, 6, cc.REPEAT_FOREVER, 0.5);
    },
    init: function () {
        this._super();
        
        //background
        var staBackground = new cc.Sprite(res.StartBg);
        this.addChild(staBackground, -1, 888);
        var centerpos = cc.p(size.width/2, size.height/2);
        staBackground.setPosition(centerpos);

        // wave
        var waves = new wavesLayer(0);
        this.addChild(waves);

        //fish
        fishs = new fishsLayer();
        this.addChild(fishs);

        //bubble
        var bubbles = new bubblesLayer();
        this.addChild(bubbles);

        //title
        var sparktitle = new titleLayer();
        sparktitle.init();
        this.addChild(sparktitle);

        //menu
        var menu = new menuLayer(0);
        this.addChild(menu);
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        //播放背景音樂
        if(isMusicPlay){
            console.log("Lobby onEnterTransitionDidFinish");
            audioEngine.playMusic(res.Music_Lobby, true);
        }
    },
    addFishs: function () {
        Picno = Math.floor(Math.random()*7)+1;
        Side = Math.floor(Math.random()*2);
        State = 0; Num = 5; Offset = 1;

        fishs.init(Picno, State, Side, Num, Offset);
    },
    onExit: function () {
        console.log("onExit");
        lobby.unscheduleUpdate();
        lobby.unschedule(this.addFishs);
        lobby.removeAllChildren(true);
        this._super();
    },
    onExitTransitionDidStart: function () {
        //停止背景音樂
        audioEngine.stopMusic(res.Music_Lobby);
        this._super();
    }
});
var GameLobbyScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new lobbyLayer();
        layer.init();
        this.addChild(layer);
    }
});