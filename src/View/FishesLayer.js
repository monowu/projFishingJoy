var FishSprite = [];

var fishsLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        FishSprite = [];
        this.scheduleUpdate();
    },
    update: function () {
        this.removeFish();

        for (var i = 0; i < FishSprite.length; i++) {
            if (FishSprite[i]){
                var oldX = FishSprite[i].oldPos.x;
                var oldY = FishSprite[i].oldPos.y;
                var newX = FishSprite[i].x;
                var newY = FishSprite[i].y;

                if(newX!=oldX) {
                    FishSprite[i].rotateAngle = this.getAngle(oldX, oldY, newX, newY);
                    FishSprite[i].setRotation(FishSprite[i].rotateAngle);
                }

                FishSprite[i].oldPos = FishSprite[i].getPosition();
            }
        }
    },
    init:function (picno, state, side, num, offset) {
        var random = Math.floor(Math.random() * num) + offset;
        
        for(var i=0; i<random; i++){
            this.addFish(picno, state, side);
        }
    },
    addFish: function (picno, state, side) {
        var fishC = new FishsSprite(picno, state);
        var fish = new cc.Sprite(fishC.arrAnimFrames[0]);

        var y = fish.height/2+size.height*cc.random0To1();
        if(side == Side._right){ // from right
            fish.attr({
                x: size.width + 200,
                y: y
            });
        }else {
            fish.setFlippedX(true);
            fish.attr({
                x: -200,
                y: y
            });
        }

        var fTime = 1.0/fishC.fTime;
        var animation = cc.Animation.create(fishC.arrAnimFrames, fTime);
        var animate = cc.animate(animation).repeatForever();
        fish.runAction(animate); //repeatForever無法同步或序列化

        RandomBezier._controlPointX1 = (size.width/2)*cc.random0To1();
        RandomBezier._controlPointX2 = (size.width/2)*cc.random0To1() + size.width/2;

        var bezierAction = cc.bezierTo(fishC.fishSpeed, fishSwimming(fish, side));
        fish.runAction(bezierAction);

        //每隻魚身上所帶的參數
        fish.oldPos = cc.p(fish.x, fish.y); //現在位置
        fish.itsLife = fishC.fishLife; //生命值
        fish.fishno = fishC.fishNo; //編號
        fish.coin = fishC.fishGain; //金幣量
        fish.from = side; //從哪邊來
        fish.rotateAngle = 0; //旋轉角度
        fish.fishspeed = fishC.fishSpeed; //速度
        fish.isHit = false; //是否被擊中
        fish.isLock = false; //是否被鎖定

        this.addChild(fish);
        FishSprite.push(fish);
    },
    removeFish: function () {
        //讓離開畫面的Fish被消失
        for (var i = 0; i < FishSprite.length; i++) {
            if(FishSprite[i].x < -1100 || FishSprite[i].x > 2000) {
                //console.log("fish leave......"+FishSprite.length);
                FishSprite[i].removeFromParent(true);
                FishSprite[i] = undefined;
                FishSprite.splice(i, 1);
                i = i - 1;
            }
        }
    },
    getAngle: function (oldX, oldY, newX, newY) {
        var dx = newX - oldX;
        var dy = newY - oldY;
        var angle = Math.atan(dy/dx)* (180/Math.PI) * (-1);

        return angle;
    }
});

var fishSwimming = function (obj, side) {
    RandomBezier._endPointX = size.width-obj.x;
    RandomBezier._endPointY = size.height*cc.random0To1();
    RandomBezier._controlPointY1 = size.height*cc.random0To1();
    RandomBezier._controlPointY2 = size.height*cc.random0To1();

    var controlpt_1 = cc.p(RandomBezier._controlPointX1, RandomBezier._controlPointY1);
    var controlpt_2 = cc.p(RandomBezier._controlPointX2, RandomBezier._controlPointY2);
    
    switch (side) {
        case Side._right: // from right
            // bezier 一個終點+兩個控制點
            var endpos = cc.p(RandomBezier._endPointX-1050, RandomBezier._endPointY);
            var bezier = [controlpt_2, controlpt_1, endpos];
            break;
        case Side._left: // from left
            // bezier 一個終點+兩個控制點
            var endpos = cc.p(RandomBezier._endPointX+950, RandomBezier._endPointY);
            var bezier = [controlpt_1, controlpt_2, endpos];
            break;
        default:
            break;
    }

    return bezier;
};