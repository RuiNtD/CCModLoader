/**
 * @prettier
 *
 * Please use one of two files in the root of this repository.
 * At some point I may bundle all the files together.
 */

Game.Win("Third-party");
if (CCModLoader === undefined) var CCModLoader = {};
if (typeof CCSE == "undefined")
  Game.LoadMod("https://klattmose.github.io/CookieClicker/CCSE.js");
CCModLoader.dev = true;
CCModLoader.repoURL = "https://faynealdan.github.io/CCModLoader/";
CCModLoader.baseURL = repoURL + (dev ? "dev" : "stable") + "/";
CCModLoader.modURL = repoURL + (dev ? "dev" : "") + "CCModLoader.js";
CCModLoader.optionsURL = baseURL + "/config.html";

CCModLoader.launch = function () {
  CCModLoader.init = function () {
    CCModLoader.isLoaded = true;
    CCModLoader.modCount = 0;
    CCModLoader.config = {};
    CCModLoader.loadedMods = [
      "https://klattmose.github.io/CookieClicker/CCSE.js",
      CCModLoader.modURL,
    ];

    if (Game.bakeryName.toUpperCase().substr(0, 4) == "<IMG") {
      var temp = Game.bakeryName;
      var s = temp.indexOf('"') + 1;
      var e = temp.indexOf('"', s);

      Game.bakeryName = temp.substr(s, e - s);
      Game.bakeryNameRefresh();
    }

    eval(
      "Game.WriteSave = " +
        Game.WriteSave.toString().replace(
          "Game.bakeryName",
          "CCModLoader.GetBakeryNameForSaving()"
        )
    );

    CCModLoader.addButton();

    CCModLoader.loadConfig();
    Game.customLoad.push(CCModLoader.loadConfig);
    Game.customSave.push(CCModLoader.saveConfig);

    CCModLoader.loadMods();

    CCModLoader.ReplaceGameMenu();
    CCModLoader.countNotif();
  };

  CCModLoader.addButton = function () {
    // can't use #topbar or we don't get insertBefore
    var topBar = l("links").parentElement;
    var before = l("topbarTwitter").parentElement;
    var div = document.createElement("div");
    div.innerHTML = '<a id="topbarCCModLoader">mods</a>';
    topBar.insertBefore(div, before);
    Game.attachTooltip(
      l("topbarCCModLoader"),
      '<div style="padding:8px;width:250px;text-align:center;">Configure your mods loaded by CC Mod Loader.</div>',
      "this"
    );
    Game.customChecks.push(function () {
      let count = CCModLoader.modCount;
      l("topbarCCModLoader").innerHTML = `<b>${count}</b> mod${
        count == 1 ? "" : "s"
      }`;
    });
  };

  CCModLoader.GetBakeryNameForSaving = function () {
    return !CCModLoader.config.saveHack
      ? Game.bakeryName
      : '<IMG src="' +
          Game.bakeryName +
          '" onerror=\'Game.LoadMod("' +
          CCModLoader.modURL +
          (CCModLoader.config.cacheBypass ? "?" + Math.random() : "") +
          "\")' />";
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
    Game.localStorageSet("CCModLoader", JSON.stringify(CCModLoader.config));
  };

  CCModLoader.loadConfig = function () {
    CCModLoader.config = CCModLoader.defaultConfig();
    if (Game.localStorageGet("CCModLoader")) {
      var config = {};
      try {
        config = JSON.parse(Game.localStorageGet("CCModLoader"));
      } catch {}
      for (var pref in config) {
        CCModLoader.config[pref] = config[pref];
      }
    }
  };

  CCModLoader.defaultConfig = function () {
    return {
      autoLoad: true,
      saveHack: false,
      cacheBypass: false, // hidden setting
      mods: [],
    };
  };

  CCModLoader.ReplaceGameMenu = function () {
    Game.customOptionsMenu.push(function () {
      CCSE.AppendCollapsibleOptionsMenu(
        "CC Mod Loader",
        CCModLoader.getOptionsMenu()
      );
    });
    Game.customStatsMenu.push(function () {
      CCSE.AppendStatsGeneral(
        '<div class="listing"><b>Mods loaded :</b> ' +
          CCModLoader.modCount +
          "</div>"
      );
    });
    Game.customInfoMenu.push(function () {
      CCSE.PrependCollapsibleInfoMenu(
        "Loaded mods",
        CCModLoader.loadedMods
          .map(function (mod) {
            mod = replaceAll("<", "&lt;", mod);
            mod = replaceAll(">", "&gt;", mod);
            return (
              '<div class="listing" style="font-family:monospace">' +
              mod +
              "</div>"
            );
          })
          .join("")
      );
    });
  };

  CCModLoader.getOptionsMenu = function () {
    var options = [];
    options.push('<div class="listing">');
    options.push('<a class="option');
    if (!CCModLoader.config.saveHack) options.push(" off");
    options.push('" id="CCModLoader-savehack" ' + Game.clickStr);
    options.push('="CCModLoader.toggleSaveHack()">Save Injection</a>');
    options.push(
      // '<label>Modifies your bakery name to include a "hack" that loads CC Mod Loader automatically when your file loads.</label>'
      "<label>Saves CC Mod Loader onto your save file so it's automatically loaded when your file loads.</label>"
    );
    options.push("<br/>");
    options.push("Mod list will eventually go here. Not yet implemented!");
    options.push("</div>");
    return options.join("");
  };

  CCModLoader.toggleSaveHack = function () {
    CCModLoader.config.saveHack = !CCModLoader.config.saveHack;
    var btn = l("CCModLoader-savehack");
    if (btn)
      btn.className = "option" + (CCModLoader.config.saveHack ? "" : " off");
    CCModLoader.Tick();
  };

  CCModLoader.Tick = function () {
    PlaySound("snd/tick.mp3");
  };

  CCModLoader.countNotif = function () {
    var count = CCModLoader.modCount;
    var title = count + " Mods Auto-Loaded";
    var desc = "Configure Mod Loader from top menu";
    var time = 5;
    if (count == 1) title = "1 Mod Auto-Loaded";
    var popup = title;
    if (count == 0) {
      title = "Welcome to CC Mod Loader";
      desc = "Add mods to load from the top menu, next to the Twitter link.";
      popup = "No Mods Auto-Loaded";
      time = 0;
    }
    if (Game.prefs.popups) Game.Popup(popup);
    else Game.Notify(title, desc, [16, 5], time);
  };

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
