//Menu
From = {
    _lobby: 100,
    _game: 101
};

SchedulerList = {
    Lobby: null,
    _forLobby: 200,
    
    Game: null,
    _forGame: 201,
    
    Fever: null,
    _forFever: 202,
    
    Weapon_Aim: null,
    _forAim: 203,
    
    Weapon_Lighting: null,
    _forLighting: 204,

    BubbleFrame: null,
    _forBubble: 205
};

//遊戲參數設定
Parameters = {
    //金幣相關設定
    _totalCoins: 10000, //初始總金幣數
    _autoIncrementCoins: 1, //自動遞增之金幣數
    _autoIncrementTime: 10, //自動遞增金幣之時間間隔
    
    //等級相關設定
    _level: 1, //初始等級
    _levelpercent: 0, //初始經驗條
    _paraLevel: 10, //控制升級參數。等級越高，所需經驗值越多

    //集氣相關設定
    _hit: 0, //初始集氣條
    _plusHit: 0.25, //hit加集氣
    _minusHit: 0.1, //miss減集氣

};

Status = {
    isFever: false,
    
    isFrozen: false,
    isAim: false,
    isLighting: false,
    inEnchantment: false

};

//Fish
Side = {
    _right: 0,
    _left: 1
};

RandomBezier = {
    _controlPointX1: 0,
    _controlPointX2: 0,
    _controlPointY1: 0,
    _controlPointY2: 0,
    _endPointX: 0,
    _endPointY: 0
};