define(function(require) {

  var $ = require('elements');
  var elements = function(code) {
    return ($(document.createElement('div')).html(code).children());
  };

  return {
    elements: elements
  };
});
