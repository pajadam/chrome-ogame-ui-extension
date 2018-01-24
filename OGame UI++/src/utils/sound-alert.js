var fn = function () {
  'use strict';
  window._soundAlert = function _soundAlert (text, delay, times) {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
      return;
    }
    var say = '';
    for (var i=0 ; i<times ; i++) {
      say += text + '\n';
    }
    say = say.trim();
    var utter = new window.SpeechSynthesisUtterance(say);
    utter.rate = 0.7;
    setTimeout(function () {
      window.speechSynthesis.speak(utter);
    }, delay);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
