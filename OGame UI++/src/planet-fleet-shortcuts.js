var fn = function () {
  'use strict';
  window._addPlanetFleetShortcuts = function _addPlanetFleetShortcuts () {
    $('div#planetList > .smallplanet').each(function (_, planet) {
      var coordinates = getPlanetCoords($(planet));
      var moonID = getMoonID(planet);
      var url = '/game/index.php?page=fleet1';
      url += '&galaxy=' + coordinates[0];
      url += '&system=' + coordinates[1];
      url += '&position=' + coordinates[2];
      url += '&type=1'; // Don't know why it has to be type=1

      var transportLinkUrl = url + '&mission=3';
      var deploymentLinkUrl = url + '&mission=4';
      var expeditionLinkUrl = '/game/index.php?page=fleet1';
      expeditionLinkUrl += '&galaxy=' + coordinates[0];
      expeditionLinkUrl += '&system=' + coordinates[1];
      expeditionLinkUrl += '&position=16&type=1';
      var expeditionMoonLinkUrl = expeditionLinkUrl + '&cp=' + moonID;
      expeditionLinkUrl += '&cp=' + getPlanetID(planet);

      $(planet).css('position', 'relative');

      var transportLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:-17px;top:0px;width:15px;height:15px;padding:3px;display:inline-block;z-index:999;"',
        ' href="' + transportLinkUrl + '">',
        '<img src="' + window.uipp_images.ship + '" style="height:100%;width:100%;"/>',
        '</a>'
      ].join('');
      var deploymentLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:-17px;top:20px;width:15px;height:15px;padding:3px;display:inline-block;z-index:999;"',
        ' href="' + deploymentLinkUrl + '">',
        '<img src="' + window.uipp_images.stay + '" style="height:100%;width:100%;"/>',
        '</a>'
      ].join('');
      var expeditionLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:3px;top:-8px;padding:0 2px;display:inline-block;z-index:999;background-color:rgba(255,255,255,0.3);"',
        ' href="' + expeditionLinkUrl + '">',
        'EX',
        '</a>'
      ].join('');
      var expeditionMoonLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:24px;top:-8px;padding:0 2px;display:inline-block;z-index:999;background-color:rgba(255,255,255,0.3);"',
        ' href="' + expeditionMoonLinkUrl + '">',
        'EXM',
        '</a>'
      ].join('');
      $(planet).append(deploymentLink);
      $(planet).append(transportLink);
      $(planet).append(expeditionLink);
      if (moonID) {
        $(planet).append(expeditionMoonLink);
      }
    });

    function getPlanetCoords (planet) {
      var coordsAsText = $(planet).find('a.planetlink > span.planet-koords').text();
      var start = coordsAsText.indexOf('[');
      var end = coordsAsText.indexOf(']');
      var trimmedCoords = coordsAsText.substr(start + 1, end - start - 1);
      return trimmedCoords.split(':');
    }

    function getPlanetID (planet) {
      var attrID = $(planet).attr('id') || ''
      return attrID.replace(/^planet\-/, '') || ''
    }

    // return empty string if moon not found
    function getMoonID (planet) {
      var href = $(planet).find('.moonlink').attr('href');
      var match = /cp=(\d+)/.exec(href);
      if (match) {
        return match[1]
      }
      return ''
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
