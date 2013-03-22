define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'mobileconnection',
    name: 'Mobile Connection API',
    description: 'Expose signal strength, operator, etc for GSM and other mobile connections. This does not cover WiFi. ',
    bugs: [729173],
    isCertified: true,
    info: 'https://wiki.mozilla.org/WebAPI/WebMobileConnection',
    isPrepared: function() {
      return ('mozMobileConnection' in navigator);
    }
  });
});
