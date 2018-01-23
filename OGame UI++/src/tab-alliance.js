var fn = function () {
  'use strict';
  window._addTabAlliance = function _addTabAlliance () {
    if (document.location.href.indexOf('page=alliance') === -1) {
      return;
    }

    // add content only once
    var $el = $('body #alliance:not(.enhanced)');
    if ($el.length !== 1) {
      return;
    }

    $el.addClass('enhanced');

    var alliancePlayers = [];
    var myPlayerId = $('[name=ogame-player-id]').attr('content');
    var myAllianceId = window.config.players[myPlayerId].alliance;
    for (var key in window.config.players) {
      var player = window.config.players[key];
      player.id = key;
      if (player.alliance && player.alliance === myAllianceId) {
        alliancePlayers.push(player);
      }
    }

    if (!alliancePlayers.length) {
      return;
    }

    var tabhtml = [
      '<div style="float: left; margin-top: 2em; width: 100%">',
      '<table class="uipp-table bordered">',
      '<thead id="highscoreContent">',
      '<tr>',
      '<th>' + window._translate('PLAYER') + '</th>',
      '<th><span class="navButton uipp-score" id="points" title="Global Score"></span></th>',
      '<th>⇵</th>',
      '<th><span class="navButton uipp-score" id="fleet" title="' + window._translate('MILITARY_SCORE') + '"></span></th>',
      '<th>⇵</th>',
      '<th class="menu_icon"><span title="Ships" class="menuImage active fleet1" style="height: 27px; width: 27px; display: inline-block; margin-bottom: -5px;"></span></th>',
      '<th>⇵</th>',
      '<th><span class="navButton uipp-score" id="economy" title="' + window._translate('ECONOMY_SCORE') + '"></span></th>',
      '<th>⇵</th>',
      '<th title="Basic Building Score">B</th>',
      '<th title="Defense Score">D</th>',
      '<th title="Fleet Score">F</th>',
      '<th title="Fleet Quality">Q</th>',
      '<th>' + window._translate('PLANETS') + '</th>',
      '</tr>',
      '</thead>',
      '<tbody>',
      alliancePlayers.map(function (alliancePlayer) {
        var defenseScore = Number(alliancePlayer.militaryScore) + Number(alliancePlayer.economyScore) + Number(alliancePlayer.researchScore) - Number(alliancePlayer.globalScore);
        var basicBuildingScore = Number(alliancePlayer.economyScore) - defenseScore;
        var fleetScore = Number(alliancePlayer.militaryScore) - defenseScore;
        var fleetQuality = (fleetScore / Number(alliancePlayer.ships)).toFixed(1);
        return [
          '<tr>',
          '<td id="player-id-' + alliancePlayer.id + '" class="' + ($('[name=ogame-player-id]').attr('content') === alliancePlayer.id ? 'enhancement' : '') + '">' + alliancePlayer.name + '</td>',
          '<td data-value="' + alliancePlayer.globalScore + '">', window.uipp_scoreHumanReadable(alliancePlayer.globalScore) + '</td>',
          '<td data-value="' + window._getPlayerScoreTrend(alliancePlayer.id, 'g').n + '">' + window._getPlayerScoreTrend(alliancePlayer.id, 'g').html + '</td>',
          '<td data-value="' + alliancePlayer.militaryScore + '">', window.uipp_scoreHumanReadable(alliancePlayer.militaryScore) + '</td>',
          '<td data-value="' + window._getPlayerScoreTrend(alliancePlayer.id, 'm').n + '">' + window._getPlayerScoreTrend(alliancePlayer.id, 'm').html + '</td>',
          '<td data-value="' + (alliancePlayer.ships || 0) + '">', window.uipp_scoreHumanReadable(alliancePlayer.ships || 0) + '</td>',
          '<td data-value="' + window._getPlayerScoreTrend(alliancePlayer.id, 's').n + '">' + window._getPlayerScoreTrend(alliancePlayer.id, 's').html + '</td>',
          '<td data-value="' + alliancePlayer.economyScore + '">', window.uipp_scoreHumanReadable(alliancePlayer.economyScore) + '</td>',
          '<td data-value="' + window._getPlayerScoreTrend(alliancePlayer.id, 'e').n + '">' + window._getPlayerScoreTrend(alliancePlayer.id, 'e').html + '</td>',
          '<td data-value="' + basicBuildingScore + '">', window.uipp_scoreHumanReadable(basicBuildingScore) + '</td>',
          '<td data-value="' + defenseScore + '">', window.uipp_scoreHumanReadable(defenseScore) + '</td>',
          '<td data-value="' + fleetScore + '">', window.uipp_scoreHumanReadable(fleetScore) + '</td>',
          '<td data-value="' + fleetQuality + '">', window.uipp_scoreHumanReadable(fleetQuality) + '</td>',
          '<td data-value="' + alliancePlayer.planets.length + '">',
          '<span class="tooltip tooltipRel tooltipClose tooltipRight" rel="planets-' + alliancePlayer.id + '">',
          alliancePlayer.planets.length,
          '</span>',
          '<div id="planets-' + alliancePlayer.id + '" style="display:none">',
          alliancePlayer.planets.map(function (planet) {
            return '<a href=\'/game/index.php?page=galaxy&galaxy=' + planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '\'>[' + planet.coords.join(':') + ']</a>';
          }).join('<br>'),
          '</div>',
          '</td>',
          '</tr>'
        ].join('');
      }).join(''),

      '</tbody>',
      '</table>',
      '</div>'
    ].join('');

    $el.append($(tabhtml));

    setTimeout(function () {
      $.tablesorter.addParser({
        id: 'attr-data-value',
        is: function () { return false; },
        type: 'numeric',
        format: function (s, table, cell) {
          return Number($(cell).attr('data-value') || '0');
        }
      });

      $('table.uipp-table').tablesorter({
        cancelSelection: true,
        sortList: [[1, 1]],
        headers: {
          1: { sorter: 'attr-data-value' },
          2: { sorter: 'attr-data-value' },
          3: { sorter: 'attr-data-value' },
          4: { sorter: 'attr-data-value' },
          5: { sorter: 'attr-data-value' },
          6: { sorter: 'attr-data-value' },
          7: { sorter: 'attr-data-value' },
          8: { sorter: 'attr-data-value' },
          9: { sorter: 'attr-data-value' },
          10: { sorter: 'attr-data-value' },
          11: { sorter: 'attr-data-value' },
          12: { sorter: 'attr-data-value' }
        }
      });
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
