var fn = function () {
  'use strict';

  window._slackAlert = function _slackAlert (time, alertTypeText, message) {
    var slackAlerted = window.config.slackAlerted || {};

    for (var key in slackAlerted) {
      var info = slackAlerted[key];
      if (info.time < Date.now()) {
        delete slackAlerted[key];
      }
    }

    var key = time + '-' + alertTypeText;
    if (!slackAlerted[key]) {
      slackAlerted[key] = {
        time: time,
        alertTypeText: alertTypeText,
        message: message
      }
      if (window.config.slackHookURL) {
        jQuery.post(window.config.slackHookURL, 'payload=' + JSON.stringify({ text: message }))
      }
      window._soundAlert(message, Date.now(), 3);
    }

    window.config.slackAlerted = slackAlerted;

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
