var maskLayer = cc.Layer.extend({
    mask: null,
    ctor: function (where) {
        this._super();

        //點擊設定選單，產生遮罩
        this.mask = new cc.Sprite(res.Mask);
        this.mask.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.mask);
        
        if(where == From._game){
            //若點擊遊戲畫面的設定選單，則需暫停遊戲
            settingPause();
        }

        if (isEffectPlay == false) {
            //音效關閉
            var soundOffNormal = new cc.Sprite(res.SoundOffBTN);
            var soundOffSelected = new cc.Sprite(res.SoundOffBTN_sel);
            var soundMenuItem = new cc.MenuItemSprite(soundOffNormal, soundOffSelected,
                function () {
                    //點擊則打開音效
                    isEffectPlay = !isEffectPlay;
                    audioEngine.playEffect(res.Sound_button);

                    if(where == From._game){
                        //遊戲繼續
                        settingContinue();
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        } else {
            //音效打開
            var soundOnNormal = new cc.Sprite(res.SoundOnBTN);
            var soundOnSelected = new cc.Sprite(res.SoundOnBTN_sel);
            var soundMenuItem = new cc.MenuItemSprite(soundOnNormal, soundOnSelected,
                function () {
                    //點擊則關閉音效
                    isEffectPlay = !isEffectPlay;
                    audioEngine.stopAllEffects();

                    if(where == From._game){
                        //遊戲繼續
                        settingContinue();
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        }

        if (isMusicPlay == false) {
            //背景音樂關閉
            var musicOffNormal = new cc.Sprite(res.MusicOffBTN);
            var musicOffSelected = new cc.Sprite(res.MusicOffBTN_sel);
            var musicMenuItem = new cc.MenuItemSprite(musicOffNormal, musicOffSelected,
                function () {
                    //點擊則打開背景音樂
                    isMusicPlay = !isMusicPlay;
                    if (where == From._lobby) {
                        audioEngine.playMusic(res.Music_Lobby, true);
                    } else {
                        audioEngine.playMusic(res.Music_Game, true);
                    }

                    if(where == From._game){
                        //遊戲繼續
                        settingContinue();
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        } else {
            //背景音樂打開
            var musicOnNormal = new cc.Sprite(res.MusicOnBTN);
            var musicOnSelected = new cc.Sprite(res.MusicOnBTN_sel);
            var musicMenuItem = new cc.MenuItemSprite(musicOnNormal, musicOnSelected,
                function () {
                    //點擊則關閉背景音樂
                    isMusicPlay = !isMusicPlay;
                    if (where == From._lobby) {
                        audioEngine.stopMusic(res.Music_Lobby);
                    } else {
                        audioEngine.stopMusic(res.Music_Game);
                    }

                    if(where == From._game){
                        //遊戲繼續
                        settingContinue();
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        }

        if (where == From._game) {
            //遊戲畫面的設定選單有"回大廳"的選項
            var backNormal = new cc.Sprite(res.HomeBtn);
            var backSelected = new cc.Sprite(res.HomeBtn_sel);
            var backMenuItem = new cc.MenuItemSprite(backNormal, backSelected,
                function () {
                    if (isEffectPlay) {
                        audioEngine.playEffect(res.Sound_button);
                    }
                    cc.director.popScene();
                }, this);
        }

        var resumeNormal = new cc.Sprite(res.ResumeBtn);
        var resumeSelected = new cc.Sprite(res.ResumeBtn_sel);
        var resumeMenuItem = new cc.MenuItemSprite(resumeNormal, resumeSelected,
            function () {
                if(where == From._game){
                    //遊戲繼續
                    settingContinue();
                }

                this.removeChild(this.settingMenu);
                this.removeChild(this.mask);
            }, this);

        if(where == From._game){
            this.settingMenu = new cc.Menu(backMenuItem, soundMenuItem, musicMenuItem, resumeMenuItem);
        }else {
            this.settingMenu = new cc.Menu(soundMenuItem, musicMenuItem, resumeMenuItem);
        }


        this.settingMenu.alignItemsVertically();
        this.settingMenu.x = size.width - 45;
        if(where == From._game){
            this.settingMenu.y = 175;
        }else {
            this.settingMenu.y = 150;
        }
        this.addChild(this.settingMenu);

        //touch listener
        //遮罩，使touch無法穿透
        this.listener = cc.EventListener.create({
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
            }
        });
        cc.eventManager.addListener(this.listener, this.mask);
    }
});

var settingPause = function () {
    var nodes = FishSprite;
    for (var i in nodes) {
        var node = nodes[i];
        node.pause();
    }
    scheduleOff(SchedulerList._forGame);
    cc.eventManager.pauseTarget(background);
};

var settingContinue = function () {
    var nodes = FishSprite;
    for (var i in nodes) {
        var node = nodes[i];
        node.resume();
    }
    scheduleOn(SchedulerList._forGame);
    cc.eventManager.resumeTarget(background);
};