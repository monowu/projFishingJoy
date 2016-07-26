var scheduleOn = function(tag){
    switch (tag){
        case SchedulerList._forLobby:
            SchedulerList.Lobby.schedule(addLobbyFishs, _lobbyInterval, cc.REPEAT_FOREVER, _lobbyStartTime);
            break;
        case SchedulerList._forGame:
            SchedulerList.Game.schedule(addPlayFishs, _gameInterval, cc.REPEAT_FOREVER, _gameStartTime);
            break;
        case SchedulerList._forFever:
            SchedulerList.Fever.schedule(addMermaid, _feverInterval, cc.REPEAT_FOREVER, _feverStartTime);
            break;
        case SchedulerList._forBubble:
            SchedulerList.BubbleFrame.schedule(updateBubble, _bubbleInterval, cc.REPEAT_FOREVER, _bubbleStartTime);
            break;
        default:
            console.log("No such schedule");
            break;
    }
};

var scheduleOff = function(tag){
    switch (tag){
        case SchedulerList._forLobby:
            SchedulerList.Lobby.unschedule(addLobbyFishs);
            break;
        case SchedulerList._forGame:
            SchedulerList.Game.unschedule(addPlayFishs);
            break;
        case SchedulerList._forFever:
            SchedulerList.Fever.unschedule(addMermaid);
            break;
        case SchedulerList._forBubble:
            SchedulerList.BubbleFrame.unschedule(updateBubble);
            break;
        default:
            console.log("No such schedule");
            break;
    }
};


/*
*  Lobby Schedule相關
*/

var _Picno;
var _State;
var _Side;
var _Num;
var _Offset;

var _lobbyInterval = 4;
var _lobbyStartTime = 0.5;

var addLobbyFishs = function () {
    _Picno = Math.floor(Math.random()*7)+1;
    _Side = Math.floor(Math.random()*2);
    _State = 0; 
    _Num = 5; 
    _Offset = 1;

    LobbyFishes.init(_Picno, _State, _Side, _Num, _Offset);
};

/*
 *  Game Schedule相關
 */
var _gameInterval = 2;
var _gameStartTime = 0.5;

var addPlayFishs = function () {
    Parameters._autoIncrementTime -= _gameInterval;
    if(Parameters._autoIncrementTime == 0){
        //金幣數量每10秒加 a_iCoin
        autoIncrementCoins();
        dropCoins(1, cc.p(170, 80));
    }

    _Picno = Math.floor(Math.random()*100);
    _Side = Math.floor(Math.random()*2);
    _State = 0;

    if (_Picno < 90) {
        _Picno = Math.floor(_Picno/13) +1;
        _Num = 15;
        _Offset = 2;
    }else if (_Picno < 98 && _Picno >=90) {
        if (_Picno == 90) _Picno = 8;
        if (_Picno == 91) _Picno = 9;
        if (_Picno == 94 || _Picno == 95) _Picno = 10;
        if (_Picno == 96 || _Picno == 97) _Picno = 14;
        if (_Picno == 92) _Picno = 16;
        if (_Picno == 93) _Picno = 18;
        _Num = 2;
        _Offset = 1;
    }else{
        if(_Picno == 99){
            _Picno = 17;
        } else {
            _Picno = 13;
        }
        _Num = 0;
        _Offset = 1;
    }
    PlayFishes.init(_Picno, _State, _Side, _Num, _Offset);
};

var autoIncrementCoins = function () {
    coinsCounter(Parameters._autoIncrementCoins, 0, 1);
    Parameters._autoIncrementTime = 10;
};

/*
 *  Fever Schedule相關
 */
var _feverInterval = 11;
var _feverStartTime = 2.5;
var _feverMode = 1;
var _feverFin = false;

var addMermaid = function () {
    //清掉所有魚原本佔用的array空間
    for(var i=0; i<FishSprite.length; i++){
        FishSprite[i].removeFromParent(true);
        FishSprite[i] = undefined;
        FishSprite.splice(i, 1);
        i = i - 1;
    }
    switch (_feverMode){
        case 1:
            var picno = 11;
            var side = 0;
            var num = 0;
            var offset = 16;

            PlayFishes.init(picno, 0, side, num, offset);
            mermaidAct(picno, side, offset, _feverMode);
            break;
        case 4:
            var picno = 12;
            var side = 1;
            var num = 0;
            var offset = 16;

            PlayFishes.init(picno, 0, side, num, offset);
            mermaidAct(picno, side, offset, _feverMode);
            break;
        case 2:
            var picno = 11;
            var side = 0;
            var num = 0;
            var offset = 5;

            PlayFishes.init(picno, 0, side, num, offset);
            mermaidAct(picno, side, offset, _feverMode);
            break;
        case 3:
            var picno = 12;
            var side = 1;
            var num = 0;
            var offset = 5;

            PlayFishes.init(picno, 0, side, num, offset);
            mermaidAct(picno, side, offset, _feverMode);
            break;
        case 5:
            _feverFin = true;
            break;
        default:
            break;

    }

    if(_feverFin){
        endFever();
    }

    _feverMode++;

};

var mermaidAct = function (mPicno, mSide, mNum, mMode) {
    switch (mMode){
        case 1: case 4:
            for(var j=0; j<Math.floor(mNum/4); j++){
                var interval = 1;
                for(var i = 0+Math.floor(mNum/4)*j; i < Math.floor(mNum/4)*(j+1); i++){
                    FishSprite[i].stopAllActions();
                    var pos;
                    switch (mSide){
                        case 0:
                            // from right, to left
                            FishSprite[i].setPosition(cc.p(size.width+70+j*300, 160*interval));
                            pos = cc.p(-1200+j*300, 160*interval);
                            interval++;
                            break;
                        case 1:
                            // from left, to right
                            FishSprite[i].setPosition(cc.p(-1000+j*300, 160*interval));
                            pos = cc.p(size.width+150+j*300, 160*interval);
                            interval++;
                            break;
                    }
    
                    var mermaidC = new FishsSprite(mPicno, 0);
                    var fTime = 1.0/(mermaidC.fTime);
                    var animation = cc.Animation.create(mermaidC.arrAnimFrames, fTime);
                    var animate = cc.animate(animation).repeatForever();
                    FishSprite[i].runAction(animate);
    
                    var action = cc.moveTo( 10, pos);
                    FishSprite[i].runAction(action);
                }
            }
            break;
        case 2: case 3:
            for(var i=0; i<mNum; i++){
                FishSprite[i].stopAllActions();
                var pos1, pos2, pos3, mAngle;
                switch (mSide){
                    case 0:
                        // from right, to left
                        FishSprite[i].setPosition(cc.p(size.width+70, -100));
                        pos1 = cc.p(175*(i+1), 380);
                        pos2 = cc.p(-200, 800);
                        mAngle = 90;
                        break;
                    case 1:
                        // from left, to right
                        FishSprite[i].setPosition(cc.p(-100, -100));
                        pos1 = cc.p(size.width-175*(i+1), 380);
                        pos2 = cc.p(size.width+200, 800);
                        mAngle = -90;
                        break;
                }
    
                var mermaidC = new FishsSprite(mPicno, 0);
                var fTime = 1.0/(mermaidC.fTime);
                var animation = cc.Animation.create(mermaidC.arrAnimFrames, fTime);
                var animate = cc.animate(animation).repeatForever();
                FishSprite[i].runAction(animate);
                
                var moveAct1 = cc.moveTo( 3, pos1);
                var rotateAct = cc.rotateTo(1, mAngle);
                var delayAct = cc.delayTime(3.5);
                var moveAct2 = cc.moveTo( 3, pos2);
                FishSprite[i].runAction(cc.sequence(moveAct1, rotateAct, delayAct, moveAct2));
            }
            break;
        default:
            break;

    }

};

var endFever = function () {
    Status.isFever = false;
    _feverFin = true;
    _feverMode = 1;

    //清掉所有魚原本佔用的array空間
    for(var i=0; i<FishSprite.length; i++){
        FishSprite[i].removeFromParent(true);
        FishSprite[i] = undefined;
        FishSprite.splice(i, 1);
        i = i - 1;
    }

    //清掉fever背景
    feverBg.stopAllActions();
    feverBg.runAction(cc.sequence(cc.fadeOut(1),
        cc.callFunc(feverBg.removeFromParent, feverBg)));

    //換回Game背景音樂
    if(isMusicPlay){
        audioEngine.stopMusic(res.Music_Fever);
        audioEngine.playMusic(res.Music_Game, true);
    }

    //解除呼叫美人魚的schedule
    scheduleOff(SchedulerList._forFever);

    //間隔2秒，繼續game的schedule
    scheduleOn(SchedulerList._forGame);
};

/*
 *  Bubble Schedule相關
 */
var _bubbleInterval = 1;
var _bubbleStartTime = 0.5;

var updateBubble = function() {
    SchedulerList.BubbleFrame.addBubble();
    SchedulerList.BubbleFrame.removeBubble();
};