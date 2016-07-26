var CannonSprite = cc.Sprite.extend({
    arrAnimFrames: null,
    ctor: function (no) {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.Cannon_plist , res.Cannon_png);

        this.arrAnimFrames = [];
        var str = "actor_cannon1_" + no + "2.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        this.arrAnimFrames.push(frame);
    }
});