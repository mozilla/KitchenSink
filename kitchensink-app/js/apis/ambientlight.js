define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'ambientlight',
    name: 'Ambient light sensor',
    description: 'Device light sensor support',
    bugs: [738465],
    info: 'http://www.w3.org/TR/ambient-light/',
    isPrepared: function() {
      return('ondevicelight' in window);
    },
    tests: [
      function(callback) {
        var test = 'ambient light value is positive';
        var ambientCallback = function(event) {
          if (event.value > 0) {
            callback(true, test);
          } else {
            callback(false, test, 'Wrong value returned');
          }
          window.removeEventListener('devicelight', ambientCallback, false);
        };
        window.addEventListener('devicelight', ambientCallback, false);
      }
    ]
  });
});
