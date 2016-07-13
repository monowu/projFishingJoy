var menuLayer = cc.Layer.extend({
    where: 0,
    pauseMask: null,
    settingMenu: null,
    pauseMenu: null,
    ctor: function (where) {
        this._super();
        this.where = where;
        var pos = cc.p(0, 0);
        var startpos = cc.p(size.width / 2, size.height / 2.3);
        var settingpos = cc.p(size.width - 45, 40);

        switch (where){
            case 0: //from Lobby
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
            case 1: //from Game
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
        cc.director.pushScene(new cc.TransitionFade(1.0, new GamePlayScene()));
    },
    onSetting: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }
        if(!isFever && !isFreezen){
            this.settingMenu = new maskLayer(this.where);
            this.addChild(this.settingMenu);
        }
    }
});