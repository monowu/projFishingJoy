var wavesLayer = cc.Layer.extend({
    ctor: function (no) {
        this._super();
        this.doWave(no, null);
    },
    doWave: function (no, touchpos) {
        //網格背景層
        this.rootNode = new cc.Sprite(res.Blank);
        var nodeGrid = new cc.NodeGrid();
        nodeGrid.addChild(this.rootNode);
        this.addChild(nodeGrid, 0);

        //background
        switch (no) {
            case 0:
                var waveBg = new cc.Sprite(res.StartBg);
                break;
            case 1:
                var waveBg = new cc.Sprite(res.GameBg);
                break;
        }
        this.rootNode.addChild(waveBg, 1);
        var centerpos = cc.p(size.width, size.height);
        waveBg.setPosition(centerpos);

        var wave =  cc.waves3D(60, cc.size(15, 10), 12, 10).repeatForever();
        nodeGrid.runAction(wave);
    }
});