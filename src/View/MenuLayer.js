var menuLayer = cc.Layer.extend({
    ctor: function (where) {
        this._super();
        this.where = where;
        var pos = cc.p(0, 0);
        var startpos = cc.p(size.width / 2, size.height / 2.3);
        var settingpos = cc.p(size.width - 45, 40);

        switch (where){
            case From._lobby: //Lobby：開始＆設定選單
                var startSpriteNormal = new cc.Sprite(res.StartBtn);
                var startSpriteSelected = new cc.Sprite(res.StartBtn_sel);
                var startMenuItem = new cc.MenuItemSprite(startSpriteNormal, startSpriteSelected, this.onPlay, this);
                startMenuItem.setPosition(startpos);

                var settingSpriteNormal = new cc.Sprite(res.SettingBTN);
                var settingSpriteSelected = new cc.Sprite(res.SettingBTN_sel);
                var settingMenuItem = new cc.MenuItemSprite(settingSpriteNormal, settingSpriteSelected, this.onSetting, this);
                settingMenuItem.setPosition(settingpos);

                var menu = new cc.Menu(startMenuItem, settingMenuItem);
                menu.setPosition(pos);
                this.addChild(menu);

                break;
            case From._game: //Game：設定選單only
                var settingSpriteNormal = new cc.Sprite(res.SettingBTN);
                var settingSpriteSelected = new cc.Sprite(res.SettingBTN_sel);
                var settingMenuItem = new cc.MenuItemSprite(settingSpriteNormal, settingSpriteSelected, this.onSetting, this);
                settingMenuItem.setPosition(settingpos);

                var menu = new cc.Menu(settingMenuItem);
                menu.setPosition(pos);
                this.addChild(menu);
                break;
        }

        return true;

    },
    onPlay: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }
        //進入遊戲場景
        cc.director.pushScene(new cc.TransitionFade(1.0, new GamePlayScene()));
    },
    onSetting: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }
        if(!Status.isFever && !Status.isFrozen){
            this.settingMenu = new maskLayer(this.where);
            this.addChild(this.settingMenu);
        }
    }
});