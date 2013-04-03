define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'cors',
    name: 'CORS XHR',
    description: 'Cross-origin resource sharing support',
    info: 'https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS',
    noPreparation: true,
    /* Create a test server which will have in headers
     * Access-Control-Allow-Origin: *
     *
    tests: [
      function (callback) {
        var test = 'retrive data from external resource';

        var request = new XMLHttpRequest();
        request.open('GET', 'http://example.com', true);
        request.onload = function() {
          if (request.responseText) {
              callback(true, test);
          } else {
              callback(false, test, 'no responseText');
          }
        };
        request.onerror = request.onabort = function(e) {
          callback(false, test, e.type + ' in response');
        };
        try {
          request.send();
        } catch(e) {
          callback(false, test, e.type + ' in send');
        }
      }
    ]
    */
  });
});
