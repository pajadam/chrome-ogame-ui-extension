var fn = function () {
  'use strict';

  window._addMissionParser = function _addMissionParser () {
    var missions = [];
    $('#eventContent .tooltip.tooltipClose').each(function () {
      var $tooltip = $($(this).attr('title'));
      var $tr = $(this).parent().parent();

      var reverse = $tr.find('.icon_movement_reserve').length ? true : false;
      var neutral = $tr.find('.neutral').length ? true : false;
      var arrival = Number($tr.attr('data-arrival-time') + "000");

      var trCount = $tooltip.find('tr').length;
      var entry = {
        metal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 2) + ') td').last().text()),
        crystal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 1) + ') td').last().text()),
        deuterium: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + trCount + ') td').last().text()),
        from: $tr.find('.coordsOrigin a').text().trim(),
        fromMoon: !!$tr.find('.originFleet .moon').length,
        to: $tr.find('.destCoords a').text().trim(),
        toMoon: !!$tr.find('.destFleet .moon').length,
        nShips: $tr.find('.detailsFleet').text().trim(),
        reverse: reverse,
        neutral: neutral,
        arrival: arrival,
        type: Number($tr.attr('data-mission-type'))
      };

      // invalid resources table
      if (trCount < 4) {
        entry.metal = 0
        entry.crystal = 0
        entry.deuterium = 0
      }

      if (reverse) {
        var to = entry.to;
        var toMoon = entry.toMoon;
        entry.to = entry.from;
        entry.from = to;
        entry.toMoon = entry.fromMoon;
        entry.fromMoon = toMoon;
      }

      missions.push(entry);
    });

    missions = missions.filter(function (mission) {
      var isReturnMissionDuplicate = false;
      missions.forEach(function (otherMission) {
        if (
          mission.reverse &&
          otherMission.from === mission.to &&
          otherMission.to === mission.from &&
          otherMission.nShips === mission.nShips &&
          otherMission.metal === mission.metal &&
          otherMission.crystal === mission.crystal &&
          otherMission.deuterium === mission.deuterium &&
          otherMission.type === mission.type
        ) {
          isReturnMissionDuplicate = true;
        }
      });
      return !isReturnMissionDuplicate;
    });

    window.config.missions = missions;

    var features = window.config.features;
    missions.forEach(function (mission) {
      if (features.soundAlertExpedition && mission.reverse && mission.type === 15) {
        var planet = window._getMyPlanet(mission.to);
        if (planet) {
          window._soundAlert(window._translate('EXPEDITION_FINISHED', {
            noBold: true,
            planetName: planet.name
          }), mission.arrival - Date.now(), 2);
        }
      }
      if (features.soundAlertNeutralArrival && mission.neutral && mission.type === 3) {
        var planet = window._getMyPlanet(mission.to);
        if (planet) {
          window._soundAlert(window._translate('NEUTRAL_TRANSFER_ARRIVAL', {
            noBold: true,
            planetName: planet.name
          }), mission.arrival - Date.now(), 2);
        }
      }

      var planet = window._getMyPlanet(mission.to);
      if (planet) {
        if (features.soundAlertOverflow && !mission.toMoon && planet.resources) {
          var currentRealtimePlanetResources = getCurrentRealtimePlanetResources(planet);
          var resourceOverflow = false;
          ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
            if ((mission[resource] + currentRealtimePlanetResources[resource]) > planet.resources[resource].max) {
              resourceOverflow = true;
            }
          });
          if (resourceOverflow) {
            window._soundAlert(window._translate('RESOURCE_OVERFLOW', {
              noBold: true,
              planetName: planet.name
            }), mission.arrival - Date.now(), 2);
          }
        }

        if (!mission.reverse) {
          if (mission.type === 1 || mission.type === 10) {
            window._slackAlert(mission.arrival, 'underFire', 'Planet ' + planet.name + ' is under fire at ' + new Date(mission.arrival))
          }
        }
      }
    });

    window._saveConfig();

    function getCurrentRealtimePlanetResources (planet) {
      if (!planet.resources) {
        return { metal: 0, crystal: 0, deuterium: 0 };
      }
      var currentRealtimePlanetResources = {};
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        var actuatedAmount = Math.round(planet.resources[resource].now + planet.resources[resource].prod * ((Date.now() - planet.resources.lastUpdate) / 1000));
        if (planet.resources[resource].now > planet.resources[resource].max) {
          currentRealtimePlanetResources[resource] = planet.resources[resource].now;
        } else if (actuatedAmount > planet.resources[resource].max) {
          currentRealtimePlanetResources[resource] = planet.resources[resource].max;
        } else {
          currentRealtimePlanetResources[resource] = actuatedAmount;
        }
      });
      return currentRealtimePlanetResources;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
