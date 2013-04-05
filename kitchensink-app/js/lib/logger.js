define(function(require) {
  // TODO: add ability to change the log level

  var $ = require('zepto');
  var debugElement = $('#DEBUG');

  var send = function(type, message, el) {
    if (!el) {
      el = debugElement;
    }
    el.append('<p class="' + type + '">' + type.toUpperCase() + ': ' + message + '</p>');
  };

  var methods = {
    debug: function(message, el) {
      send('debug', message, el);
    },
    info: function(message, el) {
      send('info', message, el);
    },
    error: function(message, el) {
      send('error', message, el);
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
