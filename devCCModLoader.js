/**
 * @prettier
 */

if (CCModLoader === undefined) var CCModLoader = {};
if (typeof CCSE == "undefined")
  Game.LoadMod("https://klattmose.github.io/CookieClicker/CCSE.js");
CCModLoader.name = "CC Mod Loader";
CCModLoader.version = "1.0";
CCModLoader.GameVersion = "2.022";
CCModLoader.klattmose = [
  {
    name: "Fortune Cookie",
    desc: "Predicts the outcomes of the Grimoire minigame spells.",
    url: "https://klattmose.github.io/CookieClicker/FortuneCookie.js",
  },
  {
    name: "Klattmose Utilities",
    desc: "Create an unlimited amount of fully customizable hotkeys.",
    url: "https://klattmose.github.io/CookieClicker/KlattmoseUtilities.js",
  },
  {
    name: "Horticookie",
    desc: "A helper tool for the Garden minigame.",
    url: "https://klattmose.github.io/CookieClicker/Horticookie.js",
  },
  {
    name: "Casino",
    desc:
      "Adds a minigame to the Chancemaker building where you can play blackjack and bet cookies.",
    url: "https://klattmose.github.io/CookieClicker/minigameCasino.js",
  },
  {
    name: "American Season",
    desc: "Adds a firework themed season to the game.",
    url: "https://klattmose.github.io/CookieClicker/AmericanSeason.js",
  },
  {
    name: "Timer Widget",
    desc:
      "Adds a special object in the lower left (near Krumblor and Santa) that displays a countdown for buffs and shimmers.",
    url: "https://klattmose.github.io/CookieClicker/CCSE-POCs/TimerWidget.js",
  },
  {
    name: "Hurricane Sugar",
    desc:
      "Adds a Golden Cookie effect that briefly shortens the time for sugar lumps to ripen to 1 second.",
    url:
      "https://klattmose.github.io/CookieClicker/CCSE-POCs/HurricaneSugar.js",
  },
  {
    name: "Black Hole Inverter",
    desc:
      "Adds a new building and an appropriate amount of upgrades and achievments.",
    url:
      "https://klattmose.github.io/CookieClicker/CCSE-POCs/BlackholeInverter.js",
  },
];

CCModLoader.launch = function () {
  CCModLoader.init = function () {
    CCModLoader.isLoaded = 1;
    CCModLoader.modCount = 0;
    CCModLoader.enabled = {};
    CCModLoader.loadedMods = {};

    CCSE.customSave.push(function () {
      CCSE.save.OtherMods.CCModLoader = CCModLoader.config;
    });
    CCSE.customLoad.push(function () {
      if (CCSE.save.OtherMods.CCModLoader)
        CCModLoader.config = CCSE.save.OtherMods.CCModLoader;
      else CCModLoader.config = CCModLoader.defaultConfig();
    });

    CCModLoader.ReplaceGameMenu();
    CCModLoader.countNotif();
  };

  CCModLoader.defaultConfig = function () {
    return {
      enabled: true,
      mods: [
        {
          enabled: false,
          name: "Cookie Monster",
          url: "https://aktanusa.github.io/CookieMonster/CookieMonster.js",
        },
        {
          enabled: 0,
          name: "Cookie Monster Beta",
          url: "https://aktanusa.github.io/CookieMonster/CookieMonsterBeta.js",
        },
        {
          enabled: 0,
          extraDelay: 0,
          isLoaded: 0,
          name: "Cookie Monster Dev",
          url:
            "https://cdn.rawgit.com/Aktanusa/CookieMonster/dev/CookieMonster.js",
          waitForScriptLoad: 0,
        },
      ],
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

  CCModLoader.getOptionsMenu() = function () {
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
    var notif = "Loading " + count + " mod...";
    if (count > 1) notif = "Loading " + count + " mods...";
    if (Game.prefs.popups) Game.Popup(notif);
    else Game.Notify("CC Mod Loader", notif, [16, 5], 5);
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
