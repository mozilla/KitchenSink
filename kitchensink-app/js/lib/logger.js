define(function(require) {

  var $ = require('zepto');
  var debugElement = $('#DEBUG');
  return {
    debug: function(message) {
      debugElement.append('<p class="debug">DEBUG: ' + message + '</p>');
    }
  };

});
