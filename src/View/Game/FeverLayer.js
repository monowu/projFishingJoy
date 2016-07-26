var feverBg = null;
var feverLayer = cc.Layer.extend({
    arrFever: [],
    ctor: function () {
        this._super();
        SchedulerList.Fever = this;
        Status.isFever = true;
    },
    showFever: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_fish_comes);
        }

        if(this.arrFever[0]){
            for(var i=0; i<this.arrFever.length; i++){
                this.arrFever[i].removeFromParent(true);
                this.arrFever[i] = undefined;
            }
            this.arrFever.splice(0, this.arrFever.length);
        }

        var fever = new cc.Sprite(res.FeverTitle);
        fever.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(fever);

        fever.setScale(0.8);
        var actFadeIn = cc.fadeIn(0.5);
        var actJump = cc.jumpBy(1, cc.p(0, 10), 10, 2);
        var actFadeOut = cc.fadeOut(1.5);
        fever.runAction(cc.sequence(actFadeIn, actJump, actFadeOut));

        this.arrFever.push(fever);

    },
    doFever: function () {
        //更換背景音樂
        if(isMusicPlay){
            audioEngine.stopMusic(res.Music_Game);
            audioEngine.playMusic(res.Music_Fever, true);
        }

        //添加閃爍背景
        feverBg = cc.Sprite.create(res.FeverBg);
        feverBg.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(feverBg);
        var fadeOut = cc.fadeOut(0.5);
        var fadeIn = cc.fadeIn(0.75);
        feverBg.runAction(cc.sequence(fadeIn, fadeOut).repeatForever());

        //暫停game的schedule
        scheduleOff(SchedulerList._forGame);

        //讓所有魚往兩邊四散逃跑
        this.runrunFish();

        //美人魚進場
        scheduleOn(SchedulerList._forFever);
    },
    runrunFish: function () {
        for(var i=0; i<FishSprite.length; i++){
            if(FishSprite[i].oldPos.x < 512){
                if(FishSprite[i].from == Side._right){
                    // from right, back to right
                    FishSprite[i].setFlippedX(false);
                }else{
                    // from left, back to left
                    FishSprite[i].setFlippedX(false);
                }
                var pos = cc.p(-130,
                    FishSprite[i].height/2+size.height*cc.random0To1());
            }else{
                if(FishSprite[i].from == Side._right){
                    // from right, back to right
                    FishSprite[i].setFlippedX(true);
                }else{
                    // from left, back to left
                    FishSprite[i].setFlippedX(true);
                }
                var pos = cc.p(size.width+130,
                    FishSprite[i].height/2+size.height*cc.random0To1());
            }

            FishSprite[i].stopAllActions();

            var fishC = new FishsSprite(FishSprite[i].fishno, 0);
            var fTime = 1.0/(fishC.fTime+5);
            var animation = cc.Animation.create(fishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            FishSprite[i].runAction(animate);

            var delay = cc.delayTime(0.8);
            var action = cc.moveTo( 0.5, pos);
            FishSprite[i].runAction(cc.sequence(delay, action));

        }
    }
});
