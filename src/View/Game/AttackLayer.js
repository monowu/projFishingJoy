var attackLayer = cc.Layer.extend({
    BulletSprites: null,
    bulletC: null,
    net: null,
    collision: false,

    ctor: function () {
        this._super();
        this.BulletSprites = [];
    },
    shooting: function (no, pos, angle) {
        //sound
        if(isEffectPlay){
            switch (no){
                case 1: case 2:
                    audioEngine.playEffect(res.Sound_bullet4);
                    break;
                case 3: case 4:
                    audioEngine.playEffect(res.Sound_bullet1);
                    break;
                case 5: case 6: case 7:
                    audioEngine.playEffect(res.Sound_bullet3);
                    break;
                 case 8:
                    audioEngine.playEffect(res.Sound_bullet5);
                    break;
            }
        }

        this.drawBullet(no, pos, angle);
        this.scheduleUpdate();

    },
    update: function () {
        if (this.BulletSprites[0]) {
            for (var i=0; i<FishSprite.length; i++) {
                if (FishSprite[i]) {
                    for(var j=0; j<this.BulletSprites.length; j++){
                        var x = Math.floor(this.BulletSprites[j].x);
                        if(this.chkCollision(FishSprite[i], this.BulletSprites[j])){
                            //Collision，子彈撞到魚，彈出漁網
                            if(Status.isAim){
                                this.throwNet(FishSprite[i], this.BulletSprites[j], j);
                                this.hitFish(FishSprite[i], i);
                            }else{
                                this.throwNet(FishSprite[i], this.BulletSprites[j], j);
                                for(var k=0; k<FishSprite.length; k++){
                                    if(this.chkCollision(FishSprite[k], net)){
                                        //漁網碰到的魚都有傷害
                                        this.hitFish(FishSprite[k], k);
                                        //有hit就有集氣
                                        if(!Status.isFever && !Status.isFrozen){
                                            Parameters._hit += Parameters._plusHit;
                                            this.setEnergyBar();
                                        }
                                    }
                                }
                            }
                        }else if(x == Math.floor(this.BulletSprites[j].finPos.x)) {
                            //BulletNo Collision，子彈射程結束，自動彈出漁網
                            this.throwNet(null, this.BulletSprites[j], j);
                            if (Parameters._hit > 0 && !Status.isFever) {
                                Parameters._hit -= Parameters._minusHit;
                                this.setEnergyBar();
                            }
                        }

                    }
                }
            }
        }
    },
    chkCollision: function (target, obj) {
        if(Status.isAim && !target.isLock){
            //在Aim狀態下，若魚非被鎖定，則無視碰撞
            this.collision = false;
            return false;
        }else {
            var target_major = target.width/2 + obj.height/2; //長軸
            var target_minor = target.height/2 + obj.height/2; //短軸

            var X = obj.getPositionX() - target.getPositionX();
            var Y = obj.getPositionY() - target.getPositionY();

            var equation = (X*X)/(target_major*target_major) + (Y*Y)/(target_minor*target_minor);

            if(equation <= 1){
                //obj圓心落於橢圓內，代表碰撞產生
                this.collision = true;
                return true;
            }

            this.collision = false;
            return false;
        }
    },
    setLevelBar: function () {
        LevelBar.loadTexture(res.Level_bar);
        if(Parameters._levelpercent > 100){
            //Level Up!!!
            Parameters._level ++;
            levelCount.showLevel(Parameters._level);
            levelCount.levelUp();
            Parameters._levelpercent -= 100;
        }
        LevelBar.setPercent(Parameters._levelpercent);
    },
    setEnergyBar: function () {
        EnergyBar.loadTexture(res.Energy_bar);
        if(Parameters._hit > 100){
            //Fever!!!
            var fever = new feverLayer();
            this.addChild(fever);
            fever.showFever();
            fever.doFever();
            Parameters._hit -= 100;
        }
        EnergyBar.setPercent(Parameters._hit);
    },
    hitFish: function (target, k) {
        if(Status.isFever){
            //fever時，有hit有金幣
            dropCoins(target.coin, cc.p(target.oldPos.x, target.oldPos.y));
            coinsCounter(10, 0, 1);
        }else if(!Status.isFever && !Status.isFrozen && !target.isHit){
            //不在Fever或Frozen狀態下，若魚未被擊中過，則被擊中時要逃跑

            target.stopAllActions(); //清掉原本路徑

            var fishC = new FishsSprite(target.fishno, 0);
            var fTime = 1.0/(fishC.fTime+5);
            var animation = cc.Animation.create(fishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            target.runAction(animate);

            if(target.from == Side._right){
                RandomBezier._controlPointX2 = (target.oldPos.x/2)*cc.random0To1() + (target.oldPos.x/2);
                RandomBezier._controlPointX1 = (target.oldPos.x/2)*cc.random0To1();
            }else{
                RandomBezier._controlPointX1 = ((size.width-target.oldPos.x)/2)*cc.random0To1() + target.oldPos.x;
                RandomBezier._controlPointX2 = ((size.width-RandomBezier._controlPointX1)/2)*cc.random0To1() + RandomBezier._controlPointX1;
            }

            //重新擬定逃跑路徑，並且加速
            var bezierAction = cc.bezierTo(target.fishspeed/6, fishSwimming(target, target.from));
            var tintAct = cc.tintBy(0.3, 0, 125, 125);
            target.runAction(cc.sequence(tintAct, tintAct.reverse()));
            target.runAction(cc.sequence(cc.delayTime(0.15), bezierAction));
        
            target.isHit = true;
        }else {
            var tintAct = cc.tintBy(0.3, 0, 125, 125);
            target.runAction(cc.sequence(tintAct, tintAct.reverse()));
        }
        target.itsLife -= (bulletC.bulletHurt*(1+Parameters._level/10));

        if(target.itsLife <= 0){
            //魚死掉，lever++。有等級上限，99等。
            if(Parameters._level < 99 && !Status.isFever){
                Parameters._levelpercent += (target.coin/(Parameters._paraLevel*Parameters._level));
                this.setLevelBar();
            }

            //魚死亡換動畫並清掉其sprite
            var hitfishC = new FishsSprite(target.fishno, 1);
            var hitfish = new cc.Sprite(hitfishC.arrAnimFrames[0]);
            this.addChild(hitfish);
            hitfish.setPosition(cc.p(target.oldPos.x, target.oldPos.y));
            hitfish.setRotation(target.rotateAngle);
            if(target.from == 1) hitfish.setFlippedX(true);
            var fTime = 1.0/hitfishC.fTime;
            var animation = cc.Animation.create(hitfishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            hitfish.runAction(animate);

            //在魚死亡的地方噴出金幣，並計算目前財產
            dropCoins(target.coin, cc.p(target.oldPos.x, target.oldPos.y));
            coinsCounter(target.coin, 0, 1);

            var fadeAct = cc.fadeOut(1.0);
            hitfish.runAction(cc.sequence(fadeAct, cc.callFunc(hitfish.removeFromParent, hitfish)));
            target.removeFromParent(true);
            target = undefined;
            FishSprite.splice(k, 1);
        }
    },
    throwNet: function (target, obj, j) {
        if(target == null){
            target = obj;
        }

        bulletC = new BulletsSprite(obj.bulletNo);
        net = cc.Sprite.create(bulletC.arrNetFrames[0]);
        this.addChild(net);
        net.attr({
            x: (target.x + obj.x*2) / 3,
            y: (target.y + obj.y) / 2
        });
        obj.removeFromParent(true);
        obj = undefined;
        this.BulletSprites.splice(j, 1);
        var action = cc.fadeOut(1.0);
        net.runAction(cc.sequence(action, cc.callFunc(net.removeFromParent, net)));
    },
    drawBullet: function (no, pos, angle) {
        bulletC= new BulletsSprite(no);

        //fever子彈免費
        if(Status.isFever){
            bulletC.bulletCost = 0;
        }

        if(Parameters._totalCoins >= bulletC.bulletCost){
            var bullet = new cc.Sprite(bulletC.arrBulletFrames[0]);
            bullet.attr({ // == cannon position
                x: size.width/2+20,
                y: 30
            });

            // >=5 的子彈有動畫
            if (no >= 5) {
                var fTime = 1.0/15;
                var animation = cc.Animation.create(bulletC.arrAnimFrames, fTime);
                var animate = cc.animate(animation).repeatForever();
                bullet.runAction(animate);
            }

            //控制移動方向，依touchpos
            var x = pos.x - bullet.x;
            var y = pos.y - bullet.y;
            var nx = x / Math.sqrt(x*x + y*y);
            var ny = y / Math.sqrt(x*x + y*y);

            if(Status.isAim){
                bulletC.shootSpeed /= 2;
            }

            var bulletAction = cc.moveBy(bulletC.shootSpeed,
                cc.p(nx*(bulletC.shootRange), ny*(bulletC.shootRange)));
            bullet.runAction(bulletAction);
            bullet.setRotation(angle);
            this.addChild(bullet, 10, 123);
            this.BulletSprites.push(bullet);

            bullet.bulletNo = no;
            bullet.rotateAngle = angle;
            bullet.finPos = cc.p(bullet.x + nx*(bulletC.shootRange), bullet.y + ny*(bulletC.shootRange));

            if(!Status.isFever){
                coinsCounter(bulletC.bulletCost*(-1), 0, 1);
            }

        }else{
            // no money
            if(isEffectPlay){
                audioEngine.playEffect(res.Sound_nomoney);
            }
            coinsCounter(0, 1, 2);
        }

    }
});

var coinsCounter =  function (chgCoin, state, col) {
    Parameters._totalCoins += chgCoin;
    counter.setCounter(Parameters._totalCoins, state, col);
};

var dropCoins = function (objCoin, pos) {
    if(isEffectPlay){
        audioEngine.playEffect(res.Sound_coin_appear);
    }
    var kind = 1;
    var scale = 0.5;

    if(Status.isFever){
        objCoin = 10;
    }
    if(objCoin >= 10) kind = 2;
    var coinC = new CoinsSprite(kind);
    var coin = new cc.Sprite(coinC.arrCoinFrames[0]);

    game.addChild(coin);
    coin.setPosition(pos);
    coin.setScale(scale);

    //跳出數字(倍率)
    numMultiply(objCoin, coin);

    var fTime = 1.0/15;
    var animation = cc.Animation.create(coinC.arrCoinFrames, fTime);
    var animate = cc.animate(animation).repeatForever();
    coin.runAction(animate);

    var coinJump = cc.jumpBy(1, cc.p(0, 10), 10, 2);
    var coinMove = cc.moveTo(1, cc.p(100, 80));
    var coinFade = cc.fadeOut(0.5);
    coin.runAction(cc.sequence(coinJump,
        cc.spawn(coinMove, cc.callFunc(function () {
            if(isEffectPlay){
                audioEngine.playEffect(res.Sound_coin_fly);
            }
        }, coin)),
        cc.spawn(coinFade, cc.callFunc(function () {
            if(isEffectPlay){
                audioEngine.playEffect(res.Sound_coin_fall);
            }
        }, coin)),
        cc.callFunc(coin.removeFromParent, coin)));
};

var numMultiply = function (objCoin, coin) {
    var scale = 0.7;
    var offset = 25;
    var mulstr = 'x';
    var mulC = new NumbersSprite(mulstr, 0);
    var mul = new cc.Sprite(mulC.arrNumFrames[0]);

    var numstr1 = 1; var numstr2 = 1; var numstr3 = 1;
    switch (objCoin){
        case 1: case 10:
        numstr1 = 1; break;
        case 2:
            numstr1 = 2; break;
        case 3:
            numstr1 = 3; break;
        case 5:
            numstr1 = 5; break;
        case 150:
            numstr1 = 1;
            numstr2 = 5; break;
        case 200:
            numstr1 = 2;
            numstr2 = 0; break;
        case 250:
            numstr1 = 2;
            numstr2 = 5; break;
        case 300:
            numstr1 = 3;
            numstr2 = 0; break;
        case 500:
            numstr1 = 5;
            numstr2 = 0; break;
        case 700:
            numstr1 = 7;
            numstr2 = 0; break;
        case 1000:
            numstr1 = 1;
            numstr2 = 0;
            numstr3 = 0; break;
    }

    if(numstr2 == 1){
        var numC = new NumbersSprite(numstr1, 0);
        var num1 = new cc.Sprite(numC.arrNumFrames[0]);

        game.addChild(mul); game.addChild(num1);
        mul.setScale(scale); num1.setScale(scale);
        mul.setPosition(cc.p(coin.x+offset, coin.y)); num1.setPosition(cc.p(coin.x+offset*2, coin.y));
        var mulAct1 = cc.jumpBy(1, cc.p(0, 10), 10, 1);
        var num1Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 1);
        var mulAct2 = cc.fadeOut(0.5);
        var num1Act2 = cc.fadeOut(0.5);
        mul.runAction(cc.sequence(mulAct1, mulAct2, cc.callFunc(mul.removeFromParent, mul)));
        num1.runAction(cc.sequence(num1Act1, num1Act2, cc.callFunc(num1.removeFromParent, num1)));
    }else if(numstr3 == 1){
        var num1C = new NumbersSprite(numstr1, 0);
        var num1 = new cc.Sprite(num1C.arrNumFrames[0]);
        var num2C = new NumbersSprite(numstr2, 0);
        var num2 = new cc.Sprite(num2C.arrNumFrames[0]);

        game.addChild(mul); game.addChild(num1); game.addChild(num2);
        mul.setScale(scale); num1.setScale(scale); num2.setScale(scale);
        mul.setPosition(cc.p(coin.x+offset, coin.y)); num1.setPosition(cc.p(coin.x+offset*2, coin.y));
        num2.setPosition(cc.p(coin.x+offset*3, coin.y));
        var mulAct1 = cc.jumpBy(1, cc.p(0, 10), 10, 1);
        var num1Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 1);
        var num2Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 1);
        var mulAct2 = cc.fadeOut(0.5);
        var num1Act2 = cc.fadeOut(0.5);
        var num2Act2 = cc.fadeOut(0.5);
        mul.runAction(cc.sequence(mulAct1, mulAct2, cc.callFunc(mul.removeFromParent, mul)));
        num1.runAction(cc.sequence(num1Act1, num1Act2, cc.callFunc(num1.removeFromParent, num1)));
        num2.runAction(cc.sequence(num2Act1, num2Act2, cc.callFunc(num2.removeFromParent, num2)));
    }else{
        var num1C = new NumbersSprite(numstr1, 0);
        var num1 = new cc.Sprite(num1C.arrNumFrames[0]);
        var num2C = new NumbersSprite(numstr2, 0);
        var num2 = new cc.Sprite(num2C.arrNumFrames[0]);
        var num3C = new NumbersSprite(numstr3, 0);
        var num3 = new cc.Sprite(num3C.arrNumFrames[0]);

        game.addChild(mul); game.addChild(num1); game.addChild(num2); game.addChild(num3);
        mul.setScale(scale); num1.setScale(scale); num2.setScale(scale); num3.setScale(scale);
        mul.setPosition(cc.p(coin.x+offset, coin.y)); num1.setPosition(cc.p(coin.x+offset*2, coin.y));
        num2.setPosition(cc.p(coin.x+offset*3, coin.y)); num3.setPosition(cc.p(coin.x+offset*4, coin.y));
        var mulAct1 = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var num1Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var num2Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var num3Act1 = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var mulAct2 = cc.fadeOut(0.5);
        var num1Act2 = cc.fadeOut(0.5);
        var num2Act2 = cc.fadeOut(0.5);
        var num3Act2 = cc.fadeOut(0.5);
        mul.runAction(cc.sequence(mulAct1, mulAct2, cc.callFunc(mul.removeFromParent, mul)));
        num1.runAction(cc.sequence(num1Act1, num1Act2, cc.callFunc(num1.removeFromParent, num1)));
        num2.runAction(cc.sequence(num2Act1, num2Act2, cc.callFunc(num2.removeFromParent, num2)));
        num3.runAction(cc.sequence(num3Act1, num3Act2, cc.callFunc(num3.removeFromParent, num3)));
    }

};