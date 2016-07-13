var feverSchedule = null;
var isFever = false;
var feverLayer = cc.Layer.extend({
    feverBg: null,
    arrFever: [],
    feverFin: false,
    mode: 1,
    ctor: function () {
        this._super();
        feverSchedule = this;
        isFever = true;
    },
    showFever: function () {
        if(isEffectPlay){
            audioEngine.playEffect(res.Sound_fish_comes);
        }

        if(this.arrFever[0]){
            for(var i=0; i<this.arrFever.length; i++){
                this.arrFever[i].removeFromParent();
                this.arrFever[i] = undefined;
            }
            this.arrFever.splice(0, this.arrFever.length);
        }

        var fever = new cc.Sprite(res.Fever);
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
        this.feverBg = cc.Sprite.create(res.FeverBg);
        this.feverBg.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(this.feverBg);
        var fadeOut = cc.fadeOut(0.5);
        var fadeIn = cc.fadeIn(0.75);
        this.feverBg.runAction(cc.sequence(fadeIn, fadeOut).repeatForever());

        //暫停game的schedule
        game.unschedule(addPlayFishs);

        //讓所有魚往兩邊四散逃跑
        this.runrunFish();

        //美人魚進場
        feverSchedule.schedule(this.addMermaid, 11, cc.REPEAT_FOREVER, 2.5);

    },
    runrunFish: function () {
        for(var i=0; i<FishSprite.length; i++){
            if(FishSprite[i].oldPos.x < 512){
                if(FishSprite[i].from == 0){
                    // from right, back to right
                    FishSprite[i].setFlippedX(false);
                }else{
                    // from left, back to left
                    FishSprite[i].setFlippedX(false);
                }
                var pos = cc.p(-130,
                    FishSprite[i].height/2+size.height*cc.random0To1());
            }else{
                if(FishSprite[i].from == 0){
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

            var fishC = new fishsClass(FishSprite[i].fishno, 0);
            var fTime = 1.0/(fishC.fTime+5);
            var animation = cc.Animation.create(fishC.arrAnimFrames, fTime);
            var animate = cc.animate(animation).repeatForever();
            FishSprite[i].runAction(animate);

            var delay = cc.delayTime(0.8);
            var action = cc.moveTo( 0.5, pos);
            FishSprite[i].runAction(cc.sequence(delay, action));

        }
    },
    addMermaid: function () {
        //清掉所有魚原本佔用的array空間
        for(var i=0; i<FishSprite.length; i++){
            FishSprite[i].removeFromParent();
            FishSprite[i] = undefined;
            FishSprite.splice(i, 1);
            i = i - 1;
        }
        switch (this.mode){
            case 1:
                var picno = 11;
                var side = 0;
                var num = 0;
                var offset = 16;

                PlayFishs.init(picno, 0, side, num, offset);
                this.mermaidAct(picno, side, offset, this.mode);
                break;
            case 4:
                var picno = 12;
                var side = 1;
                var num = 0;
                var offset = 16;

                PlayFishs.init(picno, 0, side, num, offset);
                this.mermaidAct(picno, side, offset, this.mode);
                break;
            case 2:
                var picno = 11;
                var side = 0;
                var num = 0;
                var offset = 5;

                PlayFishs.init(picno, 0, side, num, offset);
                this.mermaidAct(picno, side, offset, this.mode);
                break;
            case 3:
                var picno = 12;
                var side = 1;
                var num = 0;
                var offset = 5;

                PlayFishs.init(picno, 0, side, num, offset);
                this.mermaidAct(picno, side, offset, this.mode);
                break;
            case 5:
                this.feverFin = true;
                break;
            default:
                break;

        }

        if(this.feverFin){
            this.endFever();
        }

        this.mode++;

    },
    mermaidAct: function (mPicno, mSide, mNum, mMode) {
        switch (mMode){
            case 1: case 4:
                for(var j=0; j<Math.floor(mNum/4); j++){
                    var interval = 1;
                    for(var i = 0+Math.floor(mNum/4)*j; i < Math.floor(mNum/4)*(j+1); i++){
                        FishSprite[i].stopAllActions();
                        var pos;
                        switch (mSide){
                            case 0:
                                // from right, to left
                                FishSprite[i].setPosition(cc.p(size.width+70+j*300, 160*interval));
                                pos = cc.p(-1200+j*300, 160*interval);
                                interval++;
                                break;
                            case 1:
                                // from left, to right
                                FishSprite[i].setPosition(cc.p(-1000+j*300, 160*interval));
                                pos = cc.p(size.width+150+j*300, 160*interval);
                                interval++;
                                break;
                        }

                        var mermaidC = new fishsClass(mPicno, 0);
                        var fTime = 1.0/(mermaidC.fTime);
                        var animation = cc.Animation.create(mermaidC.arrAnimFrames, fTime);
                        var animate = cc.animate(animation).repeatForever();
                        FishSprite[i].runAction(animate);

                        var action = cc.moveTo( 10, pos);
                        FishSprite[i].runAction(action);
                    }
                }
                break;
            case 2: case 3:
                for(var i=0; i<mNum; i++){
                    FishSprite[i].stopAllActions();
                    var pos1, pos2, pos3, mAngle;
                    switch (mSide){
                        case 0:
                            // from right, to left
                            FishSprite[i].setPosition(cc.p(size.width+70, -100));
                            pos1 = cc.p(175*(i+1), 380);
                            pos2 = cc.p(-200, 800);
                            mAngle = 90;
                            break;
                        case 1:
                            // from left, to right
                            FishSprite[i].setPosition(cc.p(-100, -100));
                            pos1 = cc.p(size.width-175*(i+1), 380);
                            pos2 = cc.p(size.width+200, 800);
                            mAngle = -90;
                            break;
                    }

                    var mermaidC = new fishsClass(mPicno, 0);
                    var fTime = 1.0/(mermaidC.fTime);
                    var animation = cc.Animation.create(mermaidC.arrAnimFrames, fTime);
                    var animate = cc.animate(animation).repeatForever();
                    FishSprite[i].runAction(animate);

                    //FishSprite[i].setRotation(mAngle);
                    var moveAct1 = cc.moveTo( 3, pos1);
                    var rotateAct = cc.rotateTo(1, mAngle);
                    var delayAct = cc.delayTime(3.5);
                    var moveAct2 = cc.moveTo( 3, pos2);
                    FishSprite[i].runAction(cc.sequence(moveAct1, rotateAct, delayAct, moveAct2));
                }
                break;
            default:
                break;

        }

    },
    endFever: function () {
        isFever = false;
        
        //清掉所有魚原本佔用的array空間
        for(var i=0; i<FishSprite.length; i++){
            FishSprite[i].removeFromParent();
            FishSprite[i] = undefined;
            FishSprite.splice(i, 1);
            i = i - 1;
        }
        
        //清掉fever背景
        this.feverBg.stopAllActions();
        this.feverBg.runAction(cc.sequence(cc.fadeOut(1),
                                    cc.callFunc(this.feverBg.removeFromParent, this.feverBg)));
        
        //換回Game背景音樂
        if(isMusicPlay){
            audioEngine.stopMusic(res.Music_Fever);
            audioEngine.playMusic(res.Music_Game, true);
        }
        
        //解除呼叫美人魚的schedule
        feverSchedule.unschedule(this.addMermaid);
        
        //間隔2秒，繼續game的schedule
        game.schedule(addPlayFishs, 2, cc.REPEAT_FOREVER, 2);
    }
});