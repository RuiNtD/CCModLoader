/**
 * @prettier
 */

if (CCModLoader === undefined) var CCModLoader = {};
if (typeof CCSE == "undefined")
  Game.LoadMod("https://klattmose.github.io/CookieClicker/CCSE.js");
CCModLoader.name = "CC Mod Loader";
CCModLoader.version = "1.0-dev";
CCModLoader.GameVersion = "2.022";

CCModLoader.launch = function () {
  CCModLoader.init = function () {
    CCModLoader.isLoaded = true;
    CCModLoader.modCount = 0;
    CCModLoader.config = {};
    CCModLoader.loadedMods = [
      "https://klattmose.github.io/CookieClicker/CCSE.js",
    ];

    CCModLoader.loadConfig();
    CCSE.customLoad.push(CCModLoader.loadConfig);
    CCSE.customSave.push(CCModLoader.saveConfig);

    CCModLoader.loadMods();

    CCModLoader.ReplaceGameMenu();
    CCModLoader.countNotif();
  };

  CCModLoader.loadMods = function () {
    if (!CCModLoader.config.autoLoad) return;
    for (var mod of CCModLoader.config.mods)
      if (mod.enabled) CCModLoader.loadMod(mod.url);
  };

  CCModLoader.loadMod = function (url) {
    if (CCModLoader.loadedMods.indexOf(url) >= 0) return;
    Game.LoadMod(url);
    CCModLoader.modCount++;
    CCModLoader.loadedMods.push(url);
  };

  CCModLoader.saveConfig = function () {
    CCSE.save.OtherMods.CCModLoader = CCModLoader.config;
  };

  CCModLoader.loadConfig = function () {
    CCModLoader.config = CCModLoader.defaultConfig();
    if (CCSE.save.OtherMods.CCModLoader) {
      var config = CCSE.save.OtherMods.CCModLoader;
      for (var pref in config) {
        CCModLoader.config[pref] = config[pref];
      }
    }
  };

  CCModLoader.defaultConfig = function () {
    return {
      autoLoad: true,
      mods: [],
    };
  };

  CCModLoader.ReplaceGameMenu = function () {
    Game.customOptionsMenu.push(function () {
      CCSE.AppendCollapsibleOptionsMenu(
        CCModLoader.name,
        CCModLoader.getOptionsMenu()
      );
      CCSE.AppendCollapsibleOptionsMenu(
        "CC Mod Loader: klattmose's Mods",
        "placeholder"
      );
    });
    Game.customStatsMenu.push(function () {
      CCSE.AppendStatsVersionNumber(CCModLoader.name, CCModLoader.version);
      /*var div = document.createElement("div");
      div.className = "listing";
      var lead = document.createElement("b");
      lead.innerText = "<b>Mods loaded :";
      div.appendChild(lead);
      div.appendChild(document.createTextNode(" " + CCModLoader.modCount));*/
      CCSE.AppendStatsGeneral(
        '<div class="listing"><b>Mods loaded :</b> ' +
          CCModLoader.modCount +
          "</div>"
      );
    });
  };

  CCModLoader.getOptionsMenu = function () {
    var WriteButton = function (patchName, button, on, off, callback, invert) {
      var invert = invert ? 1 : 0;
      if (!callback) callback = "";
      callback += "PlaySound('snd/tick.mp3');";
      return (
        '<a class="option" id="" ' + Game.clickStr + '="' + callback + '"></a>'
      );
    };
  };

  CCModLoader.countNotif = function () {
    var count = CCModLoader.modCount;
    var notif = "Loading " + count + " mods...";
    if (count == 1) notif = "Loading " + count + " mod...";
    if (Game.prefs.popups) Game.Popup(notif);
    else Game.Notify(CCModLoader.name, notif, [16, 5], 5);
  };

  if (
    CCSE.ConfirmGameVersion(
      CCModLoader.name,
      CCModLoader.version,
      CCModLoader.GameVersion
    )
  )
    CCModLoader.init();
};

if (!CCModLoader.isLoaded) {
  if (CCSE && CCSE.isLoaded) CCModLoader.launch();
  else {
    if (!CCSE) var CCSE = {};
    if (!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
    CCSE.postLoadHooks.push(CCModLoader.launch);
  }
}
