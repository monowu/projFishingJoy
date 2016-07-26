// view
var titleLayer = cc.Layer.extend({
    init: function () {
        this._super();

        var clip = this.clipper();
        var clipSize = clip.getContentSize();
        clip.setPosition(cc.p(size.width/2, size.height*3/4+47));
        var gameTitle = cc.Sprite.create(res.Title);
        var spark = cc.Sprite.create(res.TitleLighting);
        clip.addChild(gameTitle, 1);//添加標題
        spark.setPosition(-size.width / 2,0);
        clip.addChild(spark,2); //裁減
        clip.setScaleY(1.2);
        this.addChild(clip,4);

        var moveAction = cc.moveBy(2, cc.p(clipSize.width, 0));
        spark.runAction(cc.sequence(moveAction, cc.delayTime(0.5), moveAction.reverse()));

        this.addMark();
    },
    clipper: function () {  //以標題為大小的模板，超過則裁減
        var clipper = new cc.ClippingNode();
        var gameTitle = cc.Sprite.create(res.Title);
        clipper.setStencil(gameTitle); //創建以標題為大小的模板
        clipper.setAlphaThreshold(0);
        clipper.setContentSize(cc.size(gameTitle.getContentSize().width, gameTitle.getContentSize().height));
        
        return clipper;
    },
    addMark: function () {
        var mark = new cc.Sprite(res.TitleMark);
        mark.attr({
            x: 100,
            y: 600
        });

        mark.setRotation(-10);
        this.addChild(mark, 5);
    }
});