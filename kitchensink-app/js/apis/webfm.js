define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'webfm',
    name: 'WebFM API',
    description: 'For FM radio feature.',
    bugs: [749053],
    info: 'https://groups.google.com/forum/?fromgroups#!topic/mozilla.dev.webapi/praulcqntqa',
    isPrepared: function() {
      return ('mozFM' in navigator || 'mozFMRadio' in navigator); 
    },
    action: function() {
      var radio = navigator.mozFMRadio;
      if (radio) {
        var enableRequest = radio.enable(96.7);

        enableRequest.onsuccess = function() {
          var message = 'WebFM API:\n'
                        + '{enabled}\n' 
                        + 'antenna: {antenna}\n'
                        + 'frequency: {frequency}';

          alert(message.format({
            enabled: (radio.enabled ? 'enabled' : 'disabled'),
            antenna: radio.antennaAvailable,
            frequency: radio.frequency
          }));

          radio.disable(); 
        };

        enableRequest.onerror = function(event) {
          alert(event.target.error.name);
        };
      }
    }
  });
});
