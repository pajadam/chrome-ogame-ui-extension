var fn = function () {
  'use strict';
  window._addInprogParser = function _addInprogParser () {
    var inprog = {
      metal: $('.supply1 .time').text(),
      crystal: $('.supply2 .time').text(),
      deuterium: $('.supply3 .time').text(),
      solarPlant: $('.supply4 .time').text(),
      metalStorage: $('.supply22 .time').text(),
      crystalStorage: $('.supply23 .time').text(),
      deuteriumTank: $('.supply24 .time').text(),
      roboticsFactory: $('.station14 .time').text(),
      shipyard: $('.station21 .time').text(),
      researchLab: $('.station31 .time').text(),
      plasma: $('.research122 .time').text(),
      astro: $('.research124 .time').text()
    };

    var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
    var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
    if (!currentPlanet) {
      return;
    }

    window.config.inprog = window.config.inprog || {};

    if (document.location.href.indexOf('resources') !== -1) {
      ['metal', 'crystal', 'deuterium', 'solarPlant', 'metalStorage', 'crystalStorage', 'deuteriumTank'].forEach(function (resource) {
        delete window.config.inprog[currentPlanetCoordinatesStr + '-' + resource];
        if (inprog[resource]) {
          window.config.inprog[currentPlanetCoordinatesStr + '-' + resource] = window._gfTimeToTimestamp(inprog[resource]);
        }
      });
    }

    if (document.location.href.indexOf('station') !== -1) {
      ['roboticsFactory', 'shipyard', 'researchLab'].forEach(function (resource) {
        delete window.config.inprog[currentPlanetCoordinatesStr + '-' + resource];
        if (inprog[resource]) {
          window.config.inprog[currentPlanetCoordinatesStr + '-' + resource] = window._gfTimeToTimestamp(inprog[resource]);
        }
      });
    }

    if (document.location.href.indexOf('research') !== -1) {
      delete window.config.inprog.plasma;
      delete window.config.inprog.astro

      if (inprog.plasma) {
        window.config.inprog.plasma = window._gfTimeToTimestamp(inprog.plasma);
      }

      if (inprog.astro) {
        window.config.inprog.astro = window._gfTimeToTimestamp(inprog.astro);
      }
    }

    var features = window.config.features;
    for (var key in window.config.inprog) {
      if (window.config.inprog[key] < Date.now()) {
        delete window.config.inprog[key];
      } else if (features.soundAlertInprog) {
        (function (planet, key) {
          if (!planet) {
            return;
          }
          window._soundAlert(window._translate('INPROG_COMPLETE', {
            noBold: true,
            planetName: planet.name,
            building: getBuildingFromInprogKey(key)
          }), window.config.inprog[key] - Date.now(), 2);
        })(window._getMyPlanet(key), key);
      }
    }

    window._saveConfig();

    function getBuildingFromInprogKey (key) {
      var match = key.match(/\]-(\w+)/);
      if (!match) {
        return '';
      }
      return window._translate('BUILDING_' + match[1].toUpperCase());
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
