var bulletsClass = cc.Class.extend({
    arrBulletFrames: null,
    arrNetFrames: null,
    shootRange: 0,
    shootSpeed: 1,
    bulletHurt: 0,
    bulletCost: 0,
    ctor: function (no) {
        cc.spriteFrameCache.addSpriteFrames(res.Fish2_plist , res.Fish2_png);
        cc.spriteFrameCache.addSpriteFrames(res.Fish3_plist , res.Fish3_png);
        this.arrBulletFrames = [];
        this.arrNetFrames = [];
        switch (no) {
            case 1:
                var bulstr = "bullet02.png";
                var netstr = "net02.png";
                var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrBulletFrames.push(bullet);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            case 2:
                var bulstr = "bullet04.png";
                var netstr = "net04.png";
                var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrBulletFrames.push(bullet);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            case 3:
                var bulstr = "bullet06.png";
                var netstr = "net06.png";
                var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrBulletFrames.push(bullet);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            case 4:
                var bulstr = "bullet07.png";
                var netstr = "net07.png";
                var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrBulletFrames.push(bullet);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            case 5: case 6: case 7:
                for (var i = 1; i < 4; i++) {
                    var bulstr = "bullet0"+(no+3)+"_"+i+".png";
                    var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                    this.arrBulletFrames.push(bullet);
                }
                var netstr = "net0"+(no+3)+".png";
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            case 8:
                for (var i = 1; i < 3; i++) {
                    var bulstr = "bullet011_"+i+".png";
                    var bullet = cc.spriteFrameCache.getSpriteFrame(bulstr);
                    this.arrBulletFrames.push(bullet);
                }
                var netstr = "net0"+(no+3)+".png";
                var net = cc.spriteFrameCache.getSpriteFrame(netstr);
                this.arrNetFrames.push(net);
                this.setRangeSpeedAndHurt(no);
                break;
            default:
                break;
        }
    },
    setRangeSpeedAndHurt: function (no) {
        switch (no) {
            case 1:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 1;
                this.bulletCost = 1;
                break;
            case 2:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 2;
                this.bulletCost = 2;
                break;
            case 3:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 5;
                this.bulletCost = 5;
                break;
            case 4:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 10;
                this.bulletCost = 10;
                break;
            case 5:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 15;
                this.bulletCost = 15;
                break;
            case 6:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 30;
                this.bulletCost = 30;
                break;
            case 7:
                this.shootRange = 700;
                this.shootSpeed = 0.8;
                this.bulletHurt = 50;
                this.bulletCost = 50;
                break;
            case 8:
                this.shootRange = 850;
                this.shootSpeed = 1.5;
                this.bulletHurt = 200;
                this.bulletCost = 200;
                break;
        }
    }
});