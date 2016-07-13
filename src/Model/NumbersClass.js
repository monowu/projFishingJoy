var numbersClass = cc.Class.extend({
    arrNumFrames: null,
    ctor: function (num, col) {
        cc.spriteFrameCache.addSpriteFrames(res.NumGolden_plist , res.NumGolden_png);
        cc.spriteFrameCache.addSpriteFrames(res.NumBlack_plist , res.NumBlack_png);
        cc.spriteFrameCache.addSpriteFrames(res.NumWhite_plist , res.NumWhite_png);

        this.arrNumFrames = [];

        if(col == 0){ 
            //golden
            var numstr = "coinNum_"+num+".png";
        }else if(col == 1) { 
            //black
            var numstr = "number_black_"+num+".png";
        }else { 
            //white
            var numstr = "number_white_"+num+".png";
        }
        var num = cc.spriteFrameCache.getSpriteFrame(numstr);
        this.arrNumFrames.push(num);
    }
});