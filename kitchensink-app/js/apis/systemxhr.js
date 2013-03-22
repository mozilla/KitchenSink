define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'systemxhr',
    name: 'System XHR',
    noPreparation: true,
    tests: [
      function(callback) {
        var test = 'retrieve and parse a JSON file';

        var req = new XMLHttpRequest({
            mozSystem: true,
            mozAnon: true
        });
        req.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?address=Castro+Str,+Mountain+View,+CA&sensor=false', true);
        req.onload = function() {
          var resp = req.responseText;
          try {
            resp = JSON.parse(resp);
          } catch(e) {
            // if JSON parsing fails, the response isn't JSON - continue
            // (this is an error of the external site, not the API)
          }
          if (resp) {
            callback(true, test);
          } else {
            callback(false, test, 'no response. Is device connected to the internet?');
          }
        };
        req.onerror = req.onabort = function(e) {
          callback(false, test, e.type + ' in response');
        };
        try {
          req.send();
        } catch(e) {
          callback(false, test, e.type + ' in send');
        }
      }
    ]
  });
});
