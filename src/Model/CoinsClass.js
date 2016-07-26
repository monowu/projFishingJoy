var CoinsSprite = cc.Sprite.extend({
    arrCoinFrames: null,
    ctor: function (kind) {
        this._super();
        // kind=>1: silver kind=>2: golden
        cc.spriteFrameCache.addSpriteFrames(res.Coin_plist , res.Coin_png);

        this.arrCoinFrames = [];
        
        for (var i = 1; i <= 10; i++) {
            var coinstr = "coin_"+kind+"_"+i+".png";
            var coin = cc.spriteFrameCache.getSpriteFrame(coinstr);
            this.arrCoinFrames.push(coin);
        }
        
    }
});