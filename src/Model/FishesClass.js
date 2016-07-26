var FishsSprite = cc.Sprite.extend({
    arrAnimFrames: null,
    fishSpeed: 1,
    fishLife: 1,
    fTime: 10,
    fishNo: 0,
    fishGain: 0,
    ctor: function (picno, state) {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.Fish1_plist , res.Fish1_png);
        cc.spriteFrameCache.addSpriteFrames(res.Fish2_plist , res.Fish2_png);
        cc.spriteFrameCache.addSpriteFrames(res.Fish3_plist , res.Fish3_png);
        cc.spriteFrameCache.addSpriteFrames(res.Fish4_plist , res.Fish4_png);

        this.arrAnimFrames = [];
        switch (state) {
            case 0: 
                //normal
                if (picno==8 || picno==11 || picno==12) {
                    for (var i = 1; i < 17; i++) {
                        var str = "fish" + (picno<10? "0"+picno : picno) + "_" + (i<10? "0"+i : i) + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        this.arrAnimFrames.push(frame);
                    }
                    this.setSpeedAndLife(picno);
                }else if (picno==17) {
                    for (var i = 1; i < 9; i++) {
                        var str = "fish" + (picno<10? "0"+picno : picno) + "_" + (i<10? "0"+i : i) + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        this.arrAnimFrames.push(frame);
                    }
                    this.setSpeedAndLife(picno);
                }else {
                    for (var i = 1; i < 11; i++) {
                        var str = "fish" + (picno<10? "0"+picno : picno) + "_" + (i<10? "0"+i : i) + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        this.arrAnimFrames.push(frame);
                    }
                    this.setSpeedAndLife(picno);
                }
                break;
            case 1:
                //catch
                this.fTime = 10;
                if (picno==8 || picno==9 || picno==10 || picno==11 || picno==12 ||
                    picno==13 || picno==14 || picno==17 || picno==18) {
                    for (var i = 1; i < 5; i++) {
                        var str = "fish" + (picno<10? "0"+picno : picno) + "_catch" + "_" + (i<10? "0"+i : i) + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        this.arrAnimFrames.push(frame);
                    }
                }else {
                    for (var i = 1; i < 3; i++) {
                        var str = "fish" + (picno<10? "0"+picno : picno) + "_catch" + "_" + (i<10? "0"+i : i) + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        this.arrAnimFrames.push(frame);
                    }
                }
                break;
            default:
                break;
        }
    },
    setSpeedAndLife: function (picno) {
        this.fishNo = picno;
        switch (picno) {
            case 1: //熱帶魚
                this.fTime = 18;
                this.fishSpeed = 5;
                this.fishLife = 1;
                this.fishGain = 1;
                break;
            case 2: //紅魚
                this.fTime = 15;
                this.fishSpeed = 6;
                this.fishLife = 2;
                this.fishGain = 2;
                break;
            case 3: //綠魚
                this.fTime = 15;
                this.fishSpeed = 6;
                this.fishLife = 2;
                this.fishGain = 2;
                break;
            case 4: //烏賊
                this.fTime = 8;
                this.fishSpeed = 10;
                this.fishLife = 10;
                this.fishGain = 10;
                break;
            case 5: //Nimo
                this.fTime = 8;
                this.fishSpeed = 8;
                this.fishLife = 5;
                this.fishGain = 5;
                break;
            case 6: //藍線魚
                this.fTime = 12;
                this.fishSpeed = 8;
                this.fishLife = 5;
                this.fishGain = 5;
                break;
            case 7: //Dolly
                this.fTime = 8;
                this.fishSpeed = 10;
                this.fishLife = 10;
                this.fishGain = 10;
                break;
            case 8: //龜
                this.fTime = 12;
                this.fishSpeed = 15;
                this.fishLife = 150;
                this.fishGain = 150;
                break;
            case 9: //燈籠魚
                this.fTime = 8;
                this.fishSpeed = 15;
                this.fishLife = 200;
                this.fishGain = 200;
                break;
            case 10: //魟魚
                this.fTime = 8;
                this.fishSpeed = 20;
                this.fishLife = 200;
                this.fishGain = 200;
                break;
            case 11: //美人魚
                this.fTime = 10;
                this.fishSpeed = 10;
                this.fishLife = 3;
                this.fishGain = 50;
                break;
            case 12: //美人魚
                this.fTime = 10;
                this.fishSpeed = 10;
                this.fishLife = 3;
                this.fishGain = 50;
                break;
            case 13: //座頭鯨
                this.fTime = 5;
                this.fishSpeed = 28;
                this.fishLife = 700;
                this.fishGain = 700;
                break;
            case 14: //水母
                this.fTime = 5;
                this.fishSpeed = 18;
                this.fishLife = 250;
                this.fishGain = 250;
                break;
            case 16: //金槍魚
                this.fTime = 14;
                this.fishSpeed = 15;
                this.fishLife = 300;
                this.fishGain = 300;
                break;
            case 17: //海豚
                this.fTime = 6;
                this.fishSpeed = 30;
                this.fishLife = 1000;
                this.fishGain = 1000;
                break;
            case 18: //蛙
                this.fTime = 15;
                this.fishSpeed = 8;
                this.fishLife = 200;
                this.fishGain = 500;
                break;
            default:
                break;
        }
    }
});