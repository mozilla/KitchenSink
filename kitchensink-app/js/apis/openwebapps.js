define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'openwebapps',
    name: 'Open WebApps',
    description: 'Install web apps and manage installed webapps. Also allows an installed webapp to get payment information. Everything needed to build a Open WebApps app store.',
    bugs: [697006],
    info: 'https://developer.mozilla.org/en/OpenWebApps/The_JavaScript_API',
    isPrepared: function() {
      return ('mozApps' in navigator && 'mgmt' in navigator.mozApps);
    },
    tests: [
      function(callback) {
        var test = '';

        var request;
        try {
          request = navigator.mozApps.getSelf();
        } catch(e) {
          return callback(false, test, 'error in getSelf');
        }
        request.onsuccess = function() {
          try {
            if (request.result.manifest.name) {
              callback(true, test);
            } else {
              callback(false, test, 'no name returned');
            }
          } catch(e) {
            callback(false, test, 'error in retrieving name');
          }
        };
        request.onerror = function() {
          callback(false, test, 'errorCallback called');// request.error.name);
        };
      }
    ]
  });
});
