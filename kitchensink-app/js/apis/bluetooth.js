define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'bluetooth',
    name: 'WebBluetooth',
    description: 'Low level access to Bluetooth hardware.',
    bugs: [674737],
    isCertified: true,
    info: 'https://wiki.mozilla.org/WebAPI/WebBluetooth',
    isPrepared: function() {
      return ('mozBluetooth' in navigator);
    }
  });
});
