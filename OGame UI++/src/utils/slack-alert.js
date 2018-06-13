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
        Promise.resolve()
          .then(() => {
            if (!window.jQuery || !window.jQuery.post) {
              var script = document.createElement('script');
              script.src = '//code.jquery.com/jquery-3.3.1.min.js';
              script.type = 'text/javascript';
              document.getElementsByTagName('head')[0].appendChild(script);
              return new Promise((resolve) => setTimeout(resolve, 5000))
            }
          })
          .then(() => {
            return jQuery.post(window.config.slackHookURL, 'payload=' + JSON.stringify({ text: message }))
          })
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
