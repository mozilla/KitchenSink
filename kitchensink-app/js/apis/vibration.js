define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
      id: 'vibration',
      name: 'Vibration API',
      description: 'Control device vibration for things like haptic feedback in games. Not intended to solve things like vibration for notification.',
      info: 'https://developer.mozilla.org/en-US/docs/DOM/window.navigator.vibrate',
      bugs: [679966],
      isPrepared: function() {
        return ('vibrate' in navigator);
      },
      action: function() {
        navigator.vibrate(300);
      }
    });
});
