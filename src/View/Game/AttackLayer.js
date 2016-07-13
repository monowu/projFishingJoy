var _paraLevel = 5;
var _plusHit = 0.25;
var _minusHit = 0.1;

var No;

var attackLayer = cc.Layer.extend({
    arrNoMoney: null,
    BulletSprites: null,
    bulletC: null,
    net: null,
    collision: false,

    ctor: function () {
        this._super();
        this.arrNoMoney = [];
        this.BulletSprites = [];
    },
    shooting: function (no, pos, angle) {
        No = no;

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

        this.drawBullet(No, pos, angle);
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
                            if(isAim){
                                this.BulletSprites[j].removeFromParent();
                                this.BulletSprites[j] = undefined;
                                this.BulletSprites.splice(j, 1);
                                this.hitFish(FishSprite[i], i);
                            }else{
                                this.throwNet(FishSprite[i], this.BulletSprites[j], j);
                                for(var k=0; k<FishSprite.length; k++){
                                    if(this.chkCollision(FishSprite[k], net)){
                                        //漁網碰到的魚都有傷害
                                        this.hitFish(FishSprite[k], k);
                                        //有hit就有集氣
                                        if(!isFever && !isFreezen){
                                            _hit += _plusHit;
                                            this.setEnergyBar();
                                        }
                                    }
                                }
                                var action = cc.fadeOut(1.0);
                                net.runAction(cc.sequence(action, cc.callFunc(net.removeFromParent, net)));
                            }
                        }else if(x == Math.floor(this.BulletSprites[j].finPos.x)) {
                            //No Collision，子彈射程結束，自動彈出漁網
                            this.throwNet(null, this.BulletSprites[j], j);
                            if (_hit > 0 && !isFever) {
                                _hit -= _minusHit;
                                this.setEnergyBar();
                            }
                        }

                    }
                }
            }
        }
    },
    chkCollision: function (target, obj) {
        if(isAim && !target.isLock){
            this.collision = false;
            return false;
        }else {
            var target_major = target.width/2 + obj.height/2; //長軸
            var target_minor = target.height/2 + obj.height/2; //短軸

            var X = obj.getPositionX() - target.getPositionX();
            var Y = obj.getPositionY() - target.getPositionY();

            var equation = (X*X)/(target_major*target_major)
                + (Y*Y)/(target_minor*target_minor);


            if(equation <= 1){
                this.collision = true;
                return true;
            }

            this.collision = false;
            return false;
        }
    },
    setLevelBar: function () {
        LevelBar.loadTexture(res.Level_bar);
        if(_levelpercent > 100){
            //Level Up!!!
            _level ++;
            levelCount.showLevel(_level);
            levelCount.levelUp();
            _levelpercent -= 100;
        }
        LevelBar.setPercent(_levelpercent);
    },
    setEnergyBar: function () {
        EnergyBar.loadTexture(res.Energy_bar);
        if(_hit > 100){
            //Fever!!!
            var fever = new feverLayer();
            this.addChild(fever);
            fever.showFever();
            fever.doFever();
            _hit -= 100;
        }
        EnergyBar.setPercent(_hit);
    },
    hitFish: function (obj, k) {
        if(isFever){
            //fever時，有hit有金幣
            dropCoins(obj.coin, cc.p(obj.oldPos.x, obj.oldPos.y));
            coinsCounter(10, 0, 1);
            obj.itsLife -= (bulletC.bulletHurt*(1+_level/10));
        }else if(!isFever && !isFreezen && !obj.isHit){
            if(obj.fishno == 13){
                var tintAct = cc.tintBy(0.3, 0, 125, 125);
                obj.runAction(cc.sequence(tintAct, tintAct.reverse()));
            }else if(obj.fishno == 17){
                var tintAct = cc.tintBy(0.3, 0, 125, 125);
                obj.runAction(cc.sequence(tintAct, tintAct.reverse()));
            }else {
                obj.stopAllActions();

                var fishC = new fishsClass(obj.fishno, 0);
                var fTime = 1.0/(fishC.fTime+5);
                var animation = cc.Animation.create(fishC.arrAnimFrames, fTime);
                var animate = cc.animate(animation).repeatForever();
                obj.runAction(animate);

                if(obj.from == 0 && obj.oldPos.x < size.width/2){
                    ranW2 = (obj.oldPos.x/2)*cc.random0To1() + obj.oldPos.x;
                    ranW1 = (obj.oldPos.x/2)*cc.random0To1();
                }else if(obj.from == 1 && obj.oldPos.x > size.width/2){
                    ranW1 = ((size.width-obj.oldPos.x)/2)*cc.random0To1() + obj.oldPos.x;
                    ranW2 = ((size.width-obj.oldPos.x)/2)*cc.random0To1() + obj.oldPos.x + (size.width-obj.oldPos.x)/2;
                }else {
                    ranW1 = (size.width/2)*cc.random0To1();
                    ranW2 = (size.width/2)*cc.random0To1() + size.width/2;
                }

                var bezierAction = cc.bezierTo(obj.fishspeed/5, fishSwimming(obj, obj.from));
                var tintAct = cc.tintBy(0.3, 0, 125, 125);
                obj.runAction(cc.sequence(tintAct, tintAct.reverse()));
                obj.runAction(cc.sequence(cc.delayTime(0.15), bezierAction));

            }
            obj.isHit = true;
            obj.itsLife -= (bulletC.bulletHurt*(1+_level/10));
        }else {
            var tintAct = cc.tintBy(0.3, 0, 125, 125);
            obj.runAction(cc.sequence(tintAct, tintAct.reverse()));
            obj.itsLife -= (bulletC.bulletHurt*(1+_level/10));
        }

        if(obj.itsLife <= 0){
            //魚死掉，lever++。等級上限，99。
            if(_level < 99 && !isFever){
                _levelpercent += (obj.coin/(_paraLevel*_level));
                this.setLevelBar();
            }

            //魚死亡換動畫並清掉其sprite
            var hitfishC = new fishsClass(obj.fishno, 1);
            var hitfish = new cc.Sprite(hitfishC.arrAnimFrames[0]);
            this.addChild(hitfish);
            hitfish.setPosition(cc.p(obj.oldPos.x, obj.oldPos.y));
            hitfish.setRotation(obj.rotateAngle);
            if(obj.from == 1) hitfish.setFlippedX(true);
            var fTime = 1.0/hitfishC.fTime;
            var animation = cc.Animation.create(hitfishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            hitfish.runAction(animate);

            //在魚死亡的地方噴出金幣，並計算目前財產
            dropCoins(obj.coin, cc.p(obj.oldPos.x, obj.oldPos.y));
            coinsCounter(obj.coin, 0, 1);

            var fadeAct = cc.fadeOut(1.0);
            hitfish.runAction(cc.sequence(fadeAct, cc.callFunc(hitfish.removeFromParent, hitfish)));
            obj.removeFromParent();
            obj = undefined;
            FishSprite.splice(k, 1);
        }
    },
    throwNet: function (target, obj, j) {
        if(target == null){
            target = obj;
        }

        bulletC = new bulletsClass(No);
        net = cc.Sprite.create(bulletC.arrNetFrames[0]);
        this.addChild(net);
        net.attr({
            x: (target.x + obj.x*2) / 3,
            y: (target.y + obj.y) / 2
        });
        obj.removeFromParent();
        obj = undefined;
        this.BulletSprites.splice(j, 1);
        if(!this.collision){
            var action = cc.fadeOut(1.0);
            net.runAction(cc.sequence(action, cc.callFunc(net.removeFromParent, net)));
        }
    },
    drawBullet: function (no, pos, angle) {
        bulletC= new bulletsClass(no);

        //fever子彈免費
        if(isFever){
            bulletC.bulletCost = 0;
        }

        if(totalCoins >= bulletC.bulletCost){
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

            if(isAim){
                bulletC.shootSpeed /= 2;
            }

            var bulletAction = cc.moveBy(bulletC.shootSpeed,
                cc.p(nx*(bulletC.shootRange), ny*(bulletC.shootRange)));
            bullet.runAction(bulletAction);
            bullet.setRotation(angle);
            this.addChild(bullet, 10, 123);
            this.BulletSprites.push(bullet);

            bullet.rotateAngle = angle;
            bullet.finPos = cc.p(bullet.x + nx*(bulletC.shootRange), bullet.y + ny*(bulletC.shootRange));

            if(!isFever){
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
    totalCoins += chgCoin;
    counter.setCounter(totalCoins, state, col);
};

var dropCoins = function (objCoin, pos) {
    if(isEffectPlay){
        audioEngine.playEffect(res.Sound_coin_appear);
    }
    var kind = 1;
    var scale = 0.5;

    if(isFever){
        objCoin = 10;
    }
    if(objCoin >= 10) kind = 2;
    var coinC = new coinsClass(kind);
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
    var mulC = new numbersClass(mulstr, 0);
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
        var numC = new numbersClass(numstr1, 0);
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
        var num1C = new numbersClass(numstr1, 0);
        var num1 = new cc.Sprite(num1C.arrNumFrames[0]);
        var num2C = new numbersClass(numstr2, 0);
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
        var num1C = new numbersClass(numstr1, 0);
        var num1 = new cc.Sprite(num1C.arrNumFrames[0]);
        var num2C = new numbersClass(numstr2, 0);
        var num2 = new cc.Sprite(num2C.arrNumFrames[0]);
        var num3C = new numbersClass(numstr3, 0);
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