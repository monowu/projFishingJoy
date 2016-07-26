var Presenter = cc.Node.extend({
    onScheduler: function (tag) {
        scheduleOn(tag);
    },
    offScheduler: function (tag) {
        scheduleOff(tag);
    },
    addTouchListener: function () {
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                //點擊範圍判斷
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    var touchPos = locationInNode;
                    if(Status.isLighting){
                    }else {
                        cannons.updateRotation(touchPos);
                    }
                }
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    var touchPos = locationInNode;
                    if(Status.isLighting){
                        Weapons.setVertex(touchPos);
                    }else {
                        cannons.updateRotation(touchPos);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.touchListener, background);
    },
    musicOn: function (from) {
            switch (from){
                case From._lobby:
                    audioEngine.playMusic(res.Music_Lobby, true);
                    break;
                case From._game:
                    audioEngine.playMusic(res.Music_Game, true);
                    break;
            }
    },
    musicOff: function(from){
        switch (from) {
            case From._lobby:
                audioEngine.stopMusic(res.Music_Lobby);
                break;
            case From._game:
                audioEngine.stopMusic(res.Music_Game);
                break;
        }
    }
});