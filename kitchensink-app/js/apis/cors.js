define(function(require) {
  var log = require('logger');
  var API = require('./models').API;
  var settings = require('settings');

  return new API({
    id: 'cors',
    name: 'CORS XHR',
    description: 'Cross-origin resource sharing support',
    info: 'https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS',
    noPreparation: true,
    /* Create a test server which will have in headers
     * Access-Control-Allow-Origin: *
     *
     */
    tests: [
      function (callback) {
        var test = 'Post data to external server and parse JSON response';

        var request = new XMLHttpRequest({
          mozSystem: true,
          mozAnon: true
        });
        var url = settings.get('collectionServer') + '/api/v1/cors/?format=json';
        request.open('POST', url, true);
        request.setRequestHeader('Content-type', 'application/json');
        request.setRequestHeader('X-PINGOTHER', 'pingpong');
        request.addEventListener('load', function() {
          if (request.responseText) {
            try {
              var data = JSON.parse(request.responseText);
            } catch(e) {
              callback(false, test, 'response is not JSON');
            }
            if (data.message === 'Info') {
              callback(true, test);
            } else {
              callback(false, test, 'wrong data returned');
            }
          } else {
            callback(false, test, 'no responseText');
          }
        });
        request.onerror = request.onabort = function(e) {
          if (request.status === 0) {
            callback(false, test, 'request unsent');
            return;
          }
          callback(false, test, e.type + ' (' + request.status + ') in response');
        };
        try {
          request.send('{"message":"Info"}');
        } catch(e) {
          callback(false, test, e.type + ' in send');
        }
      }
    ]
  });
});
