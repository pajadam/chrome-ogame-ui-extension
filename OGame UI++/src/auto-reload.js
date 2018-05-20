var fn = function () {
  'use strict';
  window._autoReload = function _autoReload () {
    var autoReloadConfig = window.config.autoReload || {};

    if (location.pathname === '/') {
      // already logout
      if (!autoReloadConfig.lastAlert || autoReloadConfig.lastAlert < (Date.now() - 5 * 60 * 1000)) {
        autoReloadConfig.lastAlert = Date.now()
        window._slackAlert(autoReloadConfig.lastAlert, 'logout', 'OGame logout')
        window.config.autoReload = autoReloadConfig;
        window._saveConfig();
      }
    }

    var resources = window._getCurrentPlanetResources();

    if (!resources) {
      return;
    }

    var timeout = 5 * 60 * 1000 + Math.round(15 * 60 * 1000 * Math.random())
    setTimeout(function () {
      location.href = getReloadHref();
    }, timeout);
  };

  function getReloadHref () {
    var fallback = '/game/index.php?page=overview';
    var activePlanet = $('.smallplanet .active');
    if (!activePlanet.length) {
      return fallback;
    }
    if (activePlanet.hasClass('moonlink')) {
      return activePlanet.parent().find('.planetlink').attr('href') || fallback;
    }
    var moon = activePlanet.parent().find('.moonlink');
    if (moon.length) {
      return moon.attr('href') || fallback;
    }
    return fallback;
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
