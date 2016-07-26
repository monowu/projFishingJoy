var counterLayer = cc.Layer.extend({
    CoinsDig: [],
    ctor: function () {
        this._super();
    },
    init: function (coins, state, col) {
        this.setCounter(coins, state, col);
    },
    setCounter: function (coins, state, col) {
        if(this.CoinsDig[0]){
            for(var i=0; i<this.CoinsDig.length; i++){
                this.CoinsDig[i].removeFromParent(true);
                this.CoinsDig[i] = undefined;
            }
            this.CoinsDig.splice(0, this.CoinsDig.length);
        }
        var digit = 0;
        var div = coins;
        var digits = [];
        if(div <= 0) digits.push(0);
        while(div!=0){
            digit = div % 10;
            digits.push(digit);
            div = Math.floor(div/10);
        }
        for(var i=0; i<digits.length; i++){
            var digC = new NumbersSprite(digits[i], col);
            var dig = new cc.Sprite(digC.arrNumFrames[0]);

            dig.setPosition(cc.p(198-i*28, 18));

            this.addChild(dig);
            this.CoinsDig.push(dig);
        }

        switch (state){
            case 1:
                //no money
                for(var i=0; i<this.CoinsDig.length; i++){
                    this.CoinsDig[i].setColor(cc.color(180, 0, 0));
                    var blink = cc.blink(0.5, 1);
                    this.CoinsDig[i].runAction(cc.sequence(blink, blink.reverse()));
                }
            default:
                break;
        }

    }
});