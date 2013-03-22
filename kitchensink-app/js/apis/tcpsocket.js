define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'tcpsocket',
    name: 'TCP Socket API',
    description: 'Low-level TCP socket API. Will also include SSL support.',
    bugs: [733573],
    isPrepared: function() {
      return ('TCPSocket' in window);
    }
    /* TODO:
    tests: [
      function(callback) {
        var test = '';

      }
    ]
    */
  });
});
