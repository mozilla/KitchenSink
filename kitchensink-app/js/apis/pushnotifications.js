define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'pushnotifications',
    name: 'Push Notifications API',
    description: 'Allow the platform to send notification messages to specific applications.',
    info: 'https://wiki.mozilla.org/WebAPI/SimplePush',
    bugs: [747907],
    noPreparation: true
    // isPrepared: function() {
    //   return ('mozPush' in navigator || 'push' in navigator);
    // }
  });
});
