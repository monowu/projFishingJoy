var levelLayer = cc.Layer.extend({
    arrLevelCount: [],
    arrLevelUp: [],
    ctor: function () {
        this._super();
    },
    init: function (level) {
        this.showLevel(level);
    },
    showLevel: function (level) {
        //顯示現在幾等
        if(this.arrLevelCount[0]){
            for(var i=0; i<this.arrLevelCount.length; i++){
                this.arrLevelCount[i].removeFromParent(true);
                this.arrLevelCount[i] = undefined;
            }
            this.arrLevelCount.splice(0, this.arrLevelCount.length);
        }
        var scale = 0.45;
        var digit = 0;
        var div = level;
        var digits = [];
        var length;
        while(div!=0){
            digit = div % 10;
            digits.push(digit);
            div = Math.floor(div/10);
        }
        digits.push(0);
        if(digits.length == 3){
            length = digits.length - 1;
        }else{
            length = digits.length;
        }
        for(var i=length-1; i>=0; i--){
            var digC = new NumbersSprite(digits[i], 0);
            var dig = new cc.Sprite(digC.arrNumFrames[0]);
            
            scale = 0.4;
            dig.setScale(scale);
            dig.setPosition(cc.p(88-i*14, size.height - 25));
            
            this.addChild(dig);
            this.arrLevelCount.push(dig);
        }
    },
    levelUp: function () {
        //升級
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_level_up);
        }
        if(this.arrLevelUp[0]){
            for(var i=0; i<this.arrLevelUp.length; i++){
                this.arrLevelUp[i].removeFromParent(true);
                this.arrLevelUp[i] = undefined;
            }
            this.arrLevelUp.splice(0, this.arrLevelUp.length);
        }

        //跳出LevelUp圖片
        var levelup = new cc.Sprite(res.LevelUp);
        levelup.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(levelup);
        
        var actFadeIn = cc.fadeIn(0.5);
        var actJump = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var actFadeOut = cc.fadeOut(1.5);
        levelup.runAction(cc.sequence(actFadeIn, actJump, actFadeOut));

        this.arrLevelUp.push(levelup);
        
        //全部的魚炸開，轉成金幣
        for (var i=0; i<FishSprite.length; i++) {
            var hitfishC = new FishsSprite(FishSprite[i].fishno, 1);
            var hitfish = new cc.Sprite(hitfishC.arrAnimFrames[0]);
            this.addChild(hitfish);
            hitfish.setPosition(cc.p(FishSprite[i].oldPos.x, FishSprite[i].oldPos.y));
            hitfish.setRotation(FishSprite[i].rotateAngle);
            if(FishSprite[i].from == 1) hitfish.setFlippedX(true);
            var fTime = 1.0/hitfishC.fTime;
            var animation = cc.Animation.create(hitfishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            hitfish.runAction(animate);

            //dropCoin ＆＆ coinsCounter
            dropCoins(FishSprite[i].coin, cc.p(FishSprite[i].oldPos.x, FishSprite[i].oldPos.y));
            coinsCounter(FishSprite[i].coin, 0, 1);
            
            var fadeAct = cc.fadeOut(1.0);
            hitfish.runAction(cc.sequence(fadeAct, cc.callFunc(hitfish.removeFromParent, hitfish)));
        }
        //清掉所有魚原本佔用的空間
        for(var i=0; i<FishSprite.length; i++){
            FishSprite[i].itsLife = -1;
            FishSprite[i].removeFromParent(true);
            FishSprite[i] = undefined;
            FishSprite.splice(i, 1);
            i = i - 1;
        }
    }
});