define(function(require) {
  // TODO: add ability to change the log level

  var $ = require('zepto');
  var debugElement = $('#DEBUG');

  var send = function(type, message) {
    debugElement.append('<p class="' + type + '">' + type.toUpperCase() + ': ' + message + '</p>');
  };

  var methods = {
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

  var strip = function(stripObject, type) {
    var content = '';
    var inside = false;
    for (var key in stripObject) {
      inside = true;
      content += key + ': ' + stripObject[key] + '\n';
    }
    display = (!!type ? methods[type] : alert);

    if (inside) {
      display(content);
    } else {
      display(stripObject);
    }
  };

  methods.strip = strip;
  return methods;

});
