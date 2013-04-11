define(function(require) {

  var $ = require('elements');
  require('elements/traversal');

  var setStripes = function() {
    var currentEven = $('.even');
    if (currentEven) {
      currentEven.removeClass('even');
    }
    $('#apis > dt:not(.hidden)').forEach(function(element, index) {
      if (index % 2 === 1) {
        $(element).addClass('even');
      }
    });
  };

  return {
    setStripes: setStripes
  };
});
