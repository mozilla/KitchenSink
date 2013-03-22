define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'wifiinfo',
    name: 'WiFi Information API',
    description: 'Privileged API to get a list of available WiFi networks. Also get signal strength and name of currently connected network, etc.',
    // XXX: App is closing down on this test
    // isPrepared: function() {
    //   return ('mozWifiManager' in navigator);
    // }
    info: 'https://wiki.mozilla.org/WebAPI/Security/Wifi'
  });
});
