define(function(require) {

  var $ = require('zepto');
  var debugElement = $('#DEBUG');

  var send = function(type, message) {
    debugElement.append('<p class="' + type + '">' + type.toUpperCase() + ': ' + message + '</p>')
  }
  return {
    debug: function(message) {
      send('debug', message);
    },
    info: function(message) {
      send('info', message);
    },
    error: function(message) {
      send('error', message);
    }
  };

});
