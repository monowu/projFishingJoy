var ranH1;
var ranH2;
var ranH3;
var ranW1;
var ranW2;

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
        var fishC = new fishsClass(picno, state);
        var fish = new cc.Sprite(fishC.arrAnimFrames[0]);

        var y = fish.height/2+size.height*cc.random0To1();
        if(side == 0){ // from right
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
        
        ranW1 = (size.width/2)*cc.random0To1();
        ranW2 = (size.width/2)*cc.random0To1() + size.width/2;

        var bezierAction = cc.bezierTo(fishC.fishSpeed, fishSwimming(fish, side));
        fish.runAction(bezierAction);

        fish.oldPos = cc.p(fish.x, fish.y);
        fish.itsLife = fishC.fishLife;
        fish.fishno = fishC.fishNo;
        fish.coin = fishC.fishGain;
        fish.from = side;
        fish.rotateAngle = 0;
        fish.fishspeed = fishC.fishSpeed;
        fish.isHit = false;
        fish.isLock = false;

        this.addChild(fish);
        FishSprite.push(fish);
    },
    removeFish: function () {
        //讓離開畫面的Fish被消失
        for (var i = 0; i < FishSprite.length; i++) {
            if(FishSprite[i].x < -1100 || FishSprite[i].x > 2000) {
                //console.log("fish leave......"+FishSprite.length);
                FishSprite[i].removeFromParent();
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
    ranH1 = size.height*cc.random0To1();
    ranH2 = size.height*cc.random0To1();
    ranH3 = size.height*cc.random0To1();
    switch (side) {
        case 0: // from right
            // bezier 一個終點+兩個控制點
            var endpos = cc.p(size.width-obj.x-1050, ranH1);
            var controlpt_1 = cc.p(ranW1, ranH2);
            var controlpt_2 = cc.p(ranW2, ranH3);
            var bezier = [controlpt_2, controlpt_1, endpos];
            break;
        case 1: // from left
            // bezier 一個終點+兩個控制點
            var endpos = cc.p(size.width-obj.x+950, ranH1);
            var controlpt_1 = cc.p(ranW1, ranH2);
            var controlpt_2 = cc.p(ranW2, ranH3);
            var bezier = [controlpt_1, controlpt_2, endpos];
            break;
        default:
            break;
    }

    return bezier;
};