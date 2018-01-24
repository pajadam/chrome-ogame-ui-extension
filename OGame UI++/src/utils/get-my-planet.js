var fn = function () {
  'use strict';

  window._getMyPlanet = function _getMyPlanet (key) {
    if (window.config.my.planets[key]) {
      return window.config.my.planets[key];
    }
    var coordMatch = key.match(/^\[\d+:\d+:\d+\]/);
    if (!coordMatch) {
      return null;
    }
    return window.config.my.planets[coordMatch[0]] || null;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
