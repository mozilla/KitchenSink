define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'geolocation',
    name: 'Geolocation API',
    description: 'API for locating a user using latitude and longitude coordinates.',
    info: 'https://developer.mozilla.org/en-US/docs/Using_geolocation',
    isPrepared: function() {
      return ('geolocation' in navigator && 'getCurrentPosition' in navigator.geolocation);
    },
    // XXX: for some reason getCurrentPosition is failing (timeout). 
    //      Action and test is working on desktop Firefox, but not on Unagi 
    //      please confirm.
    action: function() {
      var message = 'Geolocation: \n'
                  + 'latitude: {latitude}\n'
                  + 'longitude: {longitude}\n'
                  + 'altitude: {altitude}\n'
                  + 'accuracy: {accuracy}\n'
                  + 'altitudeAccuracy: {altitudeAccuracy}\n'
                  + 'heading: {heading}\n'
                  + 'speed: {speed}\n';
      var displayLocation = function(position) {
        alert(message.format(position.coords));
      };
      navigator.geolocation.getCurrentPosition(displayLocation);
    },
    tests: [
      function(callback) {
        var test = 'coords returned in getCurrentPosition';

        navigator.geolocation.getCurrentPosition(
          function(position) {
            if ('coords' in position) {
              return callback(true, test);
            }
            callback(false, test, 'wrong response in callback');
          }, 
          function() {
            callback(false, test, 'errorCallback called');
          }, {timeout: 2000}
        );
      }
    ] 
  });
});
