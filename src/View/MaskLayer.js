var maskLayer = cc.Layer.extend({
    mask: null,
    ctor: function (where) {
        this._super();

        this.mask = new cc.Sprite(res.Mask);
        this.mask.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(this.mask);

        if(where == 1){
            //Game
            var nodes = FishSprite;
            for (var i in nodes) {
                var node = nodes[i];
                node.pause();
            }
            game.unschedule(addPlayFishs);
            cc.eventManager.pauseTarget(background);
        }

        if (isEffectPlay == false) {
            var soundOffNormal = new cc.Sprite(res.SoundOffBTN);
            var soundOffSelected = new cc.Sprite(res.SoundOffBTN_sel);
            var soundMenuItem = new cc.MenuItemSprite(soundOffNormal, soundOffSelected,
                function () {
                    isEffectPlay = !isEffectPlay;
                    audioEngine.playEffect(res.Sound_button);

                    if(where == 1){
                        var nodes = FishSprite;
                        for (var i in nodes) {
                            var node = nodes[i];
                            node.resume();
                        }
                        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
                        cc.eventManager.resumeTarget(background);
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        } else {
            var soundOnNormal = new cc.Sprite(res.SoundOnBTN);
            var soundOnSelected = new cc.Sprite(res.SoundOnBTN_sel);
            var soundMenuItem = new cc.MenuItemSprite(soundOnNormal, soundOnSelected,
                function () {
                    isEffectPlay = !isEffectPlay;
                    audioEngine.stopAllEffects();

                    if(where == 1){
                        var nodes = FishSprite;
                        for (var i in nodes) {
                            var node = nodes[i];
                            node.resume();
                        }
                        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
                        cc.eventManager.resumeTarget(background);
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        }

        if (isMusicPlay == false) {
            var musicOffNormal = new cc.Sprite(res.MusicOffBTN);
            var musicOffSelected = new cc.Sprite(res.MusicOffBTN_sel);
            var musicMenuItem = new cc.MenuItemSprite(musicOffNormal, musicOffSelected,
                function () {
                    isMusicPlay = !isMusicPlay;
                    if (where == 0) {
                        audioEngine.playMusic(res.Music_Lobby, true);
                    } else {
                        audioEngine.playMusic(res.Music_Game, true);
                    }

                    if(where == 1){
                        var nodes = FishSprite;
                        for (var i in nodes) {
                            var node = nodes[i];
                            node.resume();
                        }
                        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
                        cc.eventManager.resumeTarget(background);
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        } else {
            var musicOnNormal = new cc.Sprite(res.MusicOnBTN);
            var musicOnSelected = new cc.Sprite(res.MusicOnBTN_sel);
            var musicMenuItem = new cc.MenuItemSprite(musicOnNormal, musicOnSelected,
                function () {
                    isMusicPlay = !isMusicPlay;
                    if (where == 0) {
                        audioEngine.stopMusic(res.Music_Lobby);
                    } else {
                        audioEngine.stopMusic(res.Music_Game);
                    }

                    if(where == 1){
                        var nodes = FishSprite;
                        for (var i in nodes) {
                            var node = nodes[i];
                            node.resume();
                        }
                        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
                        cc.eventManager.resumeTarget(background);
                    }

                    this.removeChild(this.settingMenu);
                    this.removeChild(this.mask);
                }, this);
        }

        if (where == 1) {
            //from Game
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
                if(where == 1){
                    var nodes = FishSprite;
                    for (var i in nodes) {
                        var node = nodes[i];
                        node.resume();
                    }
                    game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
                    cc.eventManager.resumeTarget(background);
                }

                this.removeChild(this.settingMenu);
                this.removeChild(this.mask);
            }, this);

        if(where == 1){
            // Game
            this.settingMenu = new cc.Menu(backMenuItem, soundMenuItem, musicMenuItem, resumeMenuItem);
        }else {
            this.settingMenu = new cc.Menu(soundMenuItem, musicMenuItem, resumeMenuItem);
        }


        this.settingMenu.alignItemsVertically();
        this.settingMenu.x = size.width - 45;
        if(where == 1){
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