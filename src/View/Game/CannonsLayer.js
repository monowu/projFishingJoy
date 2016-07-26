var cannonsLayer = cc.Layer.extend({
    cannonNO: 1, //預設為cannon 1
    cannonAngle: 0, //角度預設為0
    ctor: function () {
        this._super();
    },
    init: function () {
        this._super();

        var pos = cc.p(0, 0);
        var pluspos = cc.p(size.width/2+20+60, 25);
        var minuspos = cc.p(size.width/2+20-60, 25);

        this.newCannon();

        //plus & minus button
        var cannonPlusNormal = new cc.Sprite(res.CannonPlusBtn);
        var cannonPlusSelected = new cc.Sprite(res.CannonPlusBtn_sel);
        var cannonPlusMenuItem = new cc.MenuItemSprite(cannonPlusNormal, cannonPlusSelected, this.onCannonPlus, this);
        cannonPlusMenuItem.setPosition(pluspos);

        var cannonMinusNormal = new cc.Sprite(res.CannonMinusBtn);
        var cannonMinusSelected = new cc.Sprite(res.CannonMinusBtn_sel);
        var cannonMinusMenuItem = new cc.MenuItemSprite(cannonMinusNormal, cannonMinusSelected, this.onCannonMinus, this);
        cannonMinusMenuItem.setPosition(minuspos);

        var menu = new cc.Menu(cannonPlusMenuItem, cannonMinusMenuItem);
        menu.setPosition(pos);
        this.addChild(menu);
    },
    updateRotation: function (touchpos) {
        var dx = touchpos.x - (size.width/2+20);
        var dy = touchpos.y - 30;
        if(dy < 0) dy = 5;
        this.cannonAngle = Math.atan(dx/dy) * (180/Math.PI);
        if(this.cannonAngle > 70) this.cannonAngle = 70;
        if(this.cannonAngle < -70) this.cannonAngle = -70;

        if(this.cannonAngle != 0)
            this.removeChildByTag(this.cannonNO, true);

        this.newCannon(touchpos);
    },
    newCannon: function (touchpos) {
        var cannonC = new CannonSprite(this.cannonNO);
        var cannon = new cc.Sprite(cannonC.arrAnimFrames[0]);

        cannon.attr({
            x: size.width/2+20,
            y: 30,
            anchorX: 0.5,
            anchorY: 0.2
        });

        cannon.setRotation(this.cannonAngle);
        this.addChild(cannon, 10, this.cannonNO);

        if(touchpos != null){
            var attack = new attackLayer();
            attack.shooting(this.cannonNO, touchpos, this.cannonAngle);
            this.addChild(attack);
        }

    },
    onCannonPlus: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_plus_minus);
            audioEngine.playEffect(res.Sound_chgCannon);
        }
        if(this.cannonNO < 8){
            this.removeChildByTag(this.cannonNO, true);
            this.cannonNO += 1;
            this.newCannon();
        }else{
            this.removeChildByTag(this.cannonNO, true);
            this.cannonNO = 1;
            this.newCannon();
        }
    },
    onCannonMinus: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_plus_minus);
            audioEngine.playEffect(res.Sound_chgCannon);
        }
        if(this.cannonNO > 1){
            this.removeChildByTag(this.cannonNO, true);
            this.cannonNO -= 1;
            this.newCannon();
        }else {
            this.removeChildByTag(this.cannonNO, true);
            this.cannonNO = 8;
            this.newCannon();
        }
    }
});