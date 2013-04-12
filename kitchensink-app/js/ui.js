define(function(require) {
  var $ = require('elements');
  require('elements/traversal');

  /**
   * resets even class to all dt's without hidden class
   */
  function setStripes() {
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
