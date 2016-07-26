var BubbleSprites = [];

var bubblesLayer = cc.Layer.extend({
    BubbleSprites: null,
    ctor: function () {
        this._super();
        SchedulerList.BubbleFrame = this;
        BubbleSprites = [];
        Presenter.onScheduler(SchedulerList._forBubble);
    },
    addBubble: function () {
        var bubble = new cc.Sprite(res.Bubble);

        var x = bubble.width/2+size.width*cc.random0To1(); //bubble的x位置隨機
        bubble.attr({
            x: x,
            y: 30,
            scale: 0.3
        });

        var bubbleAction = cc.moveTo(4, cc.p(bubble.x, size.height+30));
        var bubbleAction2 = cc.scaleBy(5, 3.5);
        bubble.runAction(cc.spawn(bubbleAction, bubbleAction2));

        this.addChild(bubble);
        BubbleSprites.push(bubble);
    },
    removeBubble: function () {
        //讓離開畫面的Bubble被消失，節省資源
        for (var i = 0; i < BubbleSprites.length; i++) {
            if(BubbleSprites[i].y >= size.height+20) {
                BubbleSprites[i].removeFromParent(true);
                BubbleSprites[i] = undefined;
                BubbleSprites.splice(i, 1);
                i = i - 1;
            }
        }
    }
});
