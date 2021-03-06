var isFreezen = false;
var isAim = false;
var isLighting = false;
var inEnchantment = false;

var aimSchedule = null;
var lightingSchedule = null;

var lockonpos = null;
var aimTarget = null;

var addWeapon = cc.Layer.extend({
    timer: 9,
    freezenNo: 0,
    aimNo: 1,
    lightingNo: 2,
    enchantmentNo: 3,
    no: -1,
    arrTimer: [],
    arrVertex: [],
    arrLightingLines: [],
    ctor: function () {
        this._super();
        this.weaponMenu();
        aimSchedule = this;
        lightingSchedule = this;
    },
    updateTimer: function () {
        if(this.arrTimer[0]){
            for(var i=0; i<this.arrTimer.length; i++){
                this.arrTimer[i].removeFromParent();
                this.arrTimer[i] = undefined;
            }
            this.arrTimer.splice(0, this.arrTimer.length);
        }

        var numstr = this.timer;
        var numC = new numbersClass(numstr, 0);
        this.num = new cc.Sprite(numC.arrNumFrames[0]);
        this.num.setPosition(cc.p(size.width/2, size.height-100));
        this.addChild(this.num);
        this.arrTimer.push(this.num);

        this.timer--;

        if(this.timer < 0){
            switch (this.no){
                case this.freezenNo:
                    this.endFreezen();
                    break;
                case this.aimNo:
                    this.endAim();
                    break;
                case this.lightingNo:
                    this.endLighting();
                    break;
                default:
                    break;
            }

            this.endTimer();
            if(inEnchantment){
                //展開結界
                this.spreadEnchantment();
            }
        }

    },
    endTimer: function () {
        this.removeChild(this.num);
        this.unschedule(this.updateTimer);
    },
    weaponMenu: function () {
        var pos = cc.p(0, 0);
        var freezepos = cc.p(size.width - 320, 60);
        var aimpos = cc.p(size.width - 270, 60);
        var lightingpos = cc.p(size.width - 230, 60);


        var freezeNormal = new cc.Sprite(res.Weapon_freeze);
        var freezeSelected = new cc.Sprite(res.Weapon_freeze_sel);
        var freezeMenuItem = new cc.MenuItemSprite(freezeNormal, freezeSelected, this.freeze, this);
        freezeMenuItem.setPosition(freezepos);

        var aimNormal = new cc.Sprite(res.Weapon_aim);
        var aimSelected = new cc.Sprite(res.Weapon_aim_sel);
        var aimMenuItem = new cc.MenuItemSprite(aimNormal, aimSelected, this.aim, this);
        aimMenuItem.setPosition(aimpos);

        var lightingNormal = new cc.Sprite(res.Weapon_lightning);
        var lightingSelected = new cc.Sprite(res.Weapon_lightning_sel);
        var lightingMenuItem = new cc.MenuItemSprite(lightingNormal, lightingSelected, this.lighting, this);
        lightingMenuItem.setPosition(lightingpos);

        var menu = new cc.Menu(freezeMenuItem, aimMenuItem, lightingMenuItem);
        menu.setPosition(pos);
        this.addChild(menu);
    },
    freeze: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }
        //重複按無效，Fever、Freezen、Aim、Lighting狀態不可重複使用
        if(!isFreezen && !isFever && !isAim && !isLighting && !inEnchantment){
            isFreezen = true;
            this.no = this.freezenNo;

            //使用一次消耗500金幣
            coinsCounter(-500, 0, 1);
            
            //一次10秒
            this.timer = 9;
            this.schedule(this.updateTimer, 1, 9, 0);

            this.isFreezen();
        }
    },
    isFreezen: function () {
        this.freezebg = new cc.Sprite(res.Weapon_freeze_bg);
        this.freezebg.setPosition(size.width/2, size.height/2);
        this.addChild(this.freezebg);

        var fishs = FishSprite;
        for (var i in fishs) {
            var fish = fishs[i];
            fish.pause();
        }
        var bubbles = BubbleSprites;
        for (var i in bubbles) {
            var bubble = bubbles[i];
            bubble.pause();
        }
        game.unschedule(addPlayFishs);
        bubbleFrame.unschedule(updateBubble);
    },
    endFreezen: function () {
        isFreezen = false;
        this.no = -1;

        this.removeChild(this.freezebg);

        var fishs = FishSprite;
        for (var i in fishs) {
            var fish = fishs[i];
            fish.resume();
        }
        var bubbles = BubbleSprites;
        for (var i in bubbles) {
            var bubble = bubbles[i];
            bubble.resume();
        }
    
        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 0.2);
        bubbleFrame.schedule(updateBubble, 1, cc.REPEAT_FOREVER, 0.5);
    },
    aim: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }

        //Fever、Freezen、Aim、Lighting狀態不可重複使用
        if(!isFreezen && !isFever && !isAim && !isLighting && !inEnchantment) {
            isAim = true;
            this.no = this.aimNo;

            cc.eventManager.pauseTarget(background);

            //使用一次消耗500金幣
            coinsCounter(-500, 0, 1);

            //一次10秒
            this.timer = 9;
            this.schedule(this.updateTimer, 1, 9, 0);

            // Lock on
            aimSchedule.scheduleUpdate();

        }
    },
    update: function () {
        aimSchedule.aimListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                //點擊範圍判斷
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //選擇目標或切換目標
                    var tintAct = cc.tintBy(0.1, 0, 125, 125);
                    target.runAction(cc.sequence(tintAct, tintAct.reverse()));
                    if(aimSchedule.getScheduler() != null){
                        aimSchedule.unschedule(aimSchedule.shootingCombo);
                    }
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
                    //鎖定目標
                    aimTarget = target;
                    aimTarget.isLock = true;

                    //連擊，直到鎖定的魚死亡或離開畫面
                    aimSchedule.schedule(aimSchedule.shootingCombo, 0.1, cc.REPEAT_FOREVER, 0);
                }
            }
        });
        
        //在每隻魚身上添加 listener
        if(aimSchedule.aimListener != null){
            if(isAim){
                var fishs = FishSprite;
                for (var i in fishs) {
                    var fish = fishs[i];
                    cc.eventManager.addListener(aimSchedule.aimListener.clone(), fish);
                }
            }
        }
    },
    shootingCombo: function () {
        var life = aimTarget.itsLife;
        var pos = aimTarget.oldPos;
        if(life<=0 || pos.x<-10 || pos.x>size.width+10){
            aimSchedule.unschedule(aimSchedule.shootingCombo);
            if(aimSchedule.aimListener != null){
                cc.eventManager.removeListener(aimSchedule.aimListener);
                aimSchedule.aimListener.release();
                aimSchedule.aimListener = null;
            }
        }else{
            lockonpos = cc.p(pos.x, pos.y);
            cannons.updateRotation(lockonpos);
        }
    },
    endAim: function () {
        isAim = false;
        this.no = -1;

        cc.eventManager.resumeTarget(background);

        aimSchedule.unscheduleUpdate();
        aimSchedule.unschedule(aimSchedule.shootingCombo);

        if(aimSchedule.aimListener != null){
            var fishs = FishSprite;
            for (var i in fishs) {
                var fish = fishs[i];
                cc.eventManager.pauseTarget(fish);
                cc.eventManager.removeListener(aimSchedule.aimListener.clone());
                aimSchedule.aimListener.clone().release();
            }
            cc.eventManager.removeListener(aimSchedule.aimListener);
            aimSchedule.aimListener.release();
            aimSchedule.aimListener = null;
        }
    },
    lighting: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_button);
        }
        //Fever、Freezen、Aim、Lighting狀態不可重複使用
        if(!isFreezen && !isFever && !isAim && !isLighting) {
            //不在結界中
            if(!inEnchantment){
                isLighting = true;
                this.no = this.lightingNo;

                //使用一次消耗500金幣
                coinsCounter(-500, 0, 1);

                //一次5秒
                this.timer = 4;
                this.schedule(this.updateTimer, 1, 4, 0);
            }
        }
    },
    setVertex: function (pos) {
        this.arrVertex.push(pos);
        if(this.arrVertex.length - 1 > 0){
            this.drawLighting(this.arrVertex[this.arrVertex.length - 2], this.arrVertex[this.arrVertex.length - 1]);
        }

    },
    drawLighting: function (pos1, pos2) {
        var line = new cc.Sprite(res.Weapon_lighting);
        this.addChild(line);
        this.arrLightingLines.push(line);
        line.attr({
            x: pos1.x,
            y: pos1.y,
            anchorX: (pos1.x<pos2.x)? 0 : 1,
            anchorY: 0.5
        });
        var dx = pos2.x - pos1.x;
        var dy = pos2.y - pos1.y;
        var angle = Math.atan(dy/dx)* (180/Math.PI) * (-1);

        var x = Math.abs(dx);
        var y = Math.abs(dy);
        var scale = Math.sqrt(x*x+y*y) / line.width;

        line.setRotation(angle);
        line.setScale(scale);
    },
    endLighting: function () {
        isLighting = false;
        this.no = -1;
        inEnchantment = true;

    },
    spreadEnchantment: function () {
        this.no = this.enchantmentNo;

        //總傷害200
        this.attack = 500;
        lightingSchedule.schedule(this.isInEnchantment, 0, cc.REPEAT_FOREVER, 0);
    },
    isInEnchantment: function () {
        for(var i=0; i<FishSprite.length; i++){
            if (FishSprite[i] && this.attack > 0) {
                if(this.checkEnchantment(FishSprite[i].oldPos.x, FishSprite[i].oldPos.y)){
                    //扣血
                    //也扣雷電的生命值
                    this.attack -= FishSprite[i].itsLife;

                    //碰到閃電，翻肚
                    var hitfishC = new fishsClass(FishSprite[i].fishno, 1);
                    var hitfish = new cc.Sprite(hitfishC.arrAnimFrames[0]);
                    this.addChild(hitfish);
                    hitfish.setPosition(cc.p(FishSprite[i].oldPos.x, FishSprite[i].oldPos.y));
                    hitfish.setRotation(FishSprite[i].rotateAngle);
                    if(FishSprite[i].from == 1) hitfish.setFlippedX(true);
                    var fTime = 1.0/hitfishC.fTime;
                    var animation = cc.Animation.create(hitfishC.arrAnimFrames, fTime);
                    var animate = cc.animate(animation).repeatForever();
                    var fadeAct = cc.fadeOut(1.0);
                    hitfish.runAction(cc.spawn(animate, cc.sequence(cc.delayTime(1),
                                fadeAct, cc.callFunc(hitfish.removeFromParent, hitfish))));

                    //魚死掉
                    //在魚死亡的地方噴出金幣，並計算目前財產
                    dropCoins(FishSprite[i].coin, cc.p(FishSprite[i].oldPos.x, FishSprite[i].oldPos.y));
                    coinsCounter(FishSprite[i].coin, 0, 1);

                    FishSprite[i].itsLife = -1;
                    FishSprite[i].removeFromParent();
                    FishSprite[i] = undefined;
                    FishSprite.splice(i, 1);
                    i = i - 1;
                }
            }else {
                this.removeEnchantment();
            }
        }


    },
    checkEnchantment: function (posX, posY) {
        for(var i=0; i<this.arrVertex.length-1; i++){
            var ver1 = this.arrVertex[i];
            var ver2 = this.arrVertex[i+1];
            var dx = ver2.x - ver1.x;
            var dy = ver2.y - ver1.y;
            var m = dy / dx;
            var k = ver1.y - m*ver1.x;

            if(Math.abs(posY - m*posX -k) <= 10){
                if((dx>0?ver1.x:ver2.x) < posX && (dx>0?ver2.x:ver1.x) > posX &&
                    (dy>0?ver1.y:ver2.y) < posY && (dy>0?ver2.y:ver1.y) > posY     )
                return true;
            }
        }
        return false;
    },
    removeEnchantment: function () {
        lightingSchedule.unschedule(this.isInEnchantment);

        if(inEnchantment){
            //清掉上次的頂點、結界
            if(this.arrVertex[0]){
                for(var i=0; i<this.arrVertex.length; i++){
                    this.arrVertex[i] = undefined;
                }
                this.arrVertex.splice(0, this.arrVertex.length);
                }
                if(this.arrLightingLines[0]){
                    for(var i=0; i<this.arrLightingLines.length; i++){
                        this.arrLightingLines[i].removeFromParent();
                        this.arrLightingLines[i] = undefined;
                    }
                    this.arrLightingLines.splice(0, this.arrLightingLines.length);
                }
        }

        inEnchantment = false;
        this.no = -1;

    }
});
