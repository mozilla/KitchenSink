// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
  var $ = require('zepto');

  var debugElement = $('#DEBUG');
  var log = function(message) {
    debugElement.append('<p>' + message + '</p>');
  }

  var testElement = document.getElementById('tests');
});
