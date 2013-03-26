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
    tests: [
      function(callback) {
        var test = 'switch on and off';
        var radio = navigator.mozFMRadio;

        if (radio) {
          var enableRequest = radio.enable(96.7);
          enableRequest.onsuccess = function() {
            if (!radio.enabled) {
              return callback(false, test, 'radio is not enabled');
            }
            radio.disable();
            if (radio.enabled) {
              callback(false, test, 'radio is still enabled');
            } else {
              callback(true, test);
            }
          };
          enableRequest.onerror = function() {
            callback(false, test, 'error callback called on enabling radio');
          };
        } else {
          callback(false, test, 'mozFMRadio is falsy');
        }
      }
    ],
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
