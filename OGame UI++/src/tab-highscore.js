var fn = function () {
  'use strict';
  window._addTabHighscore = function _addTabHighscore () {
    if (document.location.href.indexOf('page=highscore') === -1) {
      return;
    }

    // add content only once
    var $el = $('body #ranks:not(.enhanced)');
    if ($el.length !== 1) {
      return;
    }

    $el.addClass('enhanced');

    var myPlayerId = $('[name=ogame-player-id]').attr('content');
    var myPlayer = window.config.players[myPlayerId];

    $el.find('tr:gt(0)').each(function () {
      var $t = $(this);
      var playerId = $t.find('.sendMail').attr('data-playerid');
      var player = window.config.players[playerId];
      if (!player) {
        if ($t.find('.playername').text().trim() !== myPlayer.name) {
          return;
        }
        player = myPlayer;
      }

      var defenseScore = Number(player.militaryScore) + Number(player.economyScore) + Number(player.researchScore) - Number(player.globalScore);
      var basicBuildingScore = Number(player.economyScore) - defenseScore;
      var fleetScore = Number(player.militaryScore) - defenseScore;
      var fleetQuality = (fleetScore / Number(player.ships)).toFixed(1);

      var tooltip = [
        'Global Score: ' + window.uipp_scoreHumanReadable(player.globalScore) + '<br>',
        'Military Score: ' + window.uipp_scoreHumanReadable(player.militaryScore) + '<br>',
        'Ships: ' + window.uipp_scoreHumanReadable(player.ships || 0) + '<br>',
        'Economy Score: ' + window.uipp_scoreHumanReadable(player.economyScore) + '<br>',
        'Research Score: ' + window.uipp_scoreHumanReadable(player.researchScore) + '<br>',
        'Basic Building Score: ' + window.uipp_scoreHumanReadable(basicBuildingScore) + '<br>',
        'Defense Score: ' + window.uipp_scoreHumanReadable(defenseScore) + '<br>',
        'Fleet Score: ' + window.uipp_scoreHumanReadable(fleetScore) + '<br>',
        'Fleet Quality: ' + window.uipp_scoreHumanReadable(fleetQuality) + '<br>'
      ].join('');
      var html = [
        '<span class="tooltip" title="' + tooltip + '">',
        '&#x265a;',
        '</span>'
      ].join('');

      $t.find('.score').prepend($(html))
    });

    setInterval(_addTabHighscore, 1000)
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
