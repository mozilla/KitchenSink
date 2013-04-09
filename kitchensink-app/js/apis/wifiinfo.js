define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'wifiinfo',
    name: 'WiFi Information API',
    description: 'Privileged API to get a list of available WiFi networks. Also get signal strength and name of currently connected network, etc.',
    info: 'https://groups.google.com/forum/?fromgroups=#!topic/mozilla.dev.webapi/7ZgMQiYcX0o',
    // XXX: App is closing down on this test
    // isPrepared: function() {
    //   return ('mozWifiManager' in navigator);
    // }
  });
});
