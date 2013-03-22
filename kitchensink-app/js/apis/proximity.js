define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'proximity',
    name: 'Proximity sensor',
    description: 'Provides information about the distance of a nearby physical object using the proximity sensor of a device.',
    bugs: [738131],
    info: 'http://www.w3.org/TR/2012/WD-proximity-20120712/',
    isPrepared: function() {
      return ('ondeviceproximity' in window);
    },
    tests: [
      function(callback) {
        var test = 'is event listener responding';
        window.addEventListener('deviceproximity', function(event) {
          // This isn't called every time the test is run...
          callback(true, test);
        });
      }
    ]
  });
});
