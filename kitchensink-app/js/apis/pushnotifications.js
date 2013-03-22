define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'pushnotifications',
    name: 'Push Notifications API',
    description: 'Allow the platform to send notification messages to specific applications.',
    bugs: [747907],
    info: 'https://wiki.mozilla.org/WebAPI/PushAPI',
    isPrepared: function() {
      return ('mozPush' in navigator || 'push' in navigator);
    }
  });
});
