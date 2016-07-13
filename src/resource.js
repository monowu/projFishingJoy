var res = {
    //image_background
    Blank : "res/Lobby/blank.png",
    Mask : "res/Lobby/mask.png",
    Bubble : "res/Items/bubble.png",
    
    //Lobby
    StartBg : "res/Lobby/startBg.jpg",
    Title : "res/Lobby/title.png",
    TitleMark : "res/Lobby/title_mark.png",
    TitleLighting : "res/Lobby/title_lighting.png",
    
    //Game
    GameBg : "res/Game/sea.jpg",
    FeverBg : "res/Game/feverBg.png",
    Bottom_bar : "res/Game/bottom_bar.png",
    Energy_bar : "res/Game/energy_bar.png",
    Fever : "res/Game/fever.png",
    Level_bar : "res/Game/level_bar.png",
    LevelBg : "res/Game/level_bg.png",
    LevelUp : "res/Game/levelup.png",
    CannonPlusBtn : "res/Game/cannon_plus.png",
    CannonPlusBtn_sel : "res/Game/cannon_plus_selected.png",
    CannonMinusBtn : "res/Game/cannon_minus.png",
    CannonMinusBtn_sel : "res/Game/cannon_minus_selected.png",
    
    //weapon
    Weapon_freeze : "res/Items/weapons/freeze.png",
    Weapon_freeze_sel : "res/Items/weapons/freeze_selected.png",
    Weapon_freeze_bg : "res/Items/weapons/freezen.png",
    Weapon_aim : "res/Items/weapons/aim.png",
    Weapon_aim_sel : "res/Items/weapons/aim_selected.png",
    Weapon_lightning : "res/Items/weapons/lightning.png",
    Weapon_lightning_sel : "res/Items/weapons/lightning_selected.png",
    Weapon_lighting : "res/Items/weapons/lighting.png",
    
    //png && plist
    Cannon_png : "res/Items/cannons/cannon.png",
    Cannon_plist : "res/Items/cannons/cannon.plist",
    Fish1_png : "res/Items/fishs/fish1.png",
    Fish1_plist : "res/Items/fishs/fish1.plist",
    Fish2_png : "res/Items/fishs/fish2.png",
    Fish2_plist : "res/Items/fishs/fish2.plist",
    Fish3_png : "res/Items/fishs/fish3.png",
    Fish3_plist : "res/Items/fishs/fish3.plist",
    Fish4_png : "res/Items/fishs/fish4.png",
    Fish4_plist : "res/Items/fishs/fish4.plist",
    Coin_png : "res/Items/money/coins.png",
    Coin_plist : "res/Items/money/coins.plist",
    NumGolden_png : "res/Items/money/number_golden.png",
    NumGolden_plist : "res/Items/money/number_golden.plist",
    NumBlack_png : "res/Items/money/number_black.png",
    NumBlack_plist : "res/Items/money/number_black.plist",
    NumWhite_png : "res/Items/money/number_white.png",
    NumWhite_plist : "res/Items/money/number_white.plist",
    
    //menu
    StartBtn : "res/MenuBtn/startBtn.png",
    StartBtn_sel : "res/MenuBtn/startBtn_selected.png",
    SettingBTN : "res/MenuBtn/settingBtn.png",
    SettingBTN_sel : "res/MenuBtn/settingBtn_selected.png",
    HomeBtn : "res/MenuBtn/homeBtn.png",
    HomeBtn_sel : "res/MenuBtn/homeBtn_selected.png",
    ResumeBtn : "res/MenuBtn/backBtn.png",
    ResumeBtn_sel : "res/MenuBtn/backBtn_selected.png",
    SoundOnBTN : "res/MenuBtn/soundBtn.png",
    SoundOnBTN_sel : "res/MenuBtn/soundBtn_selected.png",
    SoundOffBTN : "res/MenuBtn/soundOffBtn.png",
    SoundOffBTN_sel : "res/MenuBtn/soundOffBtn_selected.png",
    MusicOnBTN : "res/MenuBtn/musicBtn.png",
    MusicOnBTN_sel : "res/MenuBtn/musicBtn_selected.png",
    MusicOffBTN : "res/MenuBtn/musicOffBtn.png",
    MusicOffBTN_sel : "res/MenuBtn/musicOffBtn_selected.png",
    
    //music
    Music_Lobby : "res/Music/Bassa_Island_Game_Loop_Latinesque.mp3",
    Music_Game : "res/Music/Beach_Party_Islandesque.mp3",
    Music_Fever : "res/Music/Rag_Time_Time.mp3",
    
    //sound
    Sound_button : "res/Sound/button.mp3",
    Sound_bubble : "res/Sound/bubble.mp3",
    Sound_bullet1 : "res/Sound/bullet1.mp3",
    Sound_bullet2 : "res/Sound/bullet2.mp3",
    Sound_bullet3 : "res/Sound/bullet3.mp3",
    Sound_bullet4 : "res/Sound/bullet4.mp3",
    Sound_bullet5 : "res/Sound/bullet5.mp3",
    Sound_chgCannon : "res/Sound/chg_cannon.mp3",
    Sound_coin_appear : "res/Sound/coin_appear.mp3",
    Sound_coin_fall : "res/Sound/coin_fall.mp3",
    Sound_coin_fly : "res/Sound/coin_fly.mp3",
    Sound_fish_comes : "res/Sound/fish_comes.mp3",
    Sound_plus_minus : "res/Sound/plus_minus.mp3",
    Sound_level_up : "res/Sound/level_up.mp3",
    Sound_nomoney : "res/Sound/nomoney.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
