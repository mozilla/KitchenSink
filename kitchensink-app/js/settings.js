define(function(require) {
  var $ = require('elements');
  require('elements/events');
  require('elements/traversal');
  var setStripes = require('./ui').setStripes;

  // TODO: make this a setting
  var certifiedVisible = true;

  /**
   * hides all certified dt and closes dd if opened
   */
  function hideCertified() {
    $('dt.certified').forEach(function(element) {
      element = $(element);
      element.addClass('hidden');
      // hide description if opened
      var model = element._model;
      if (model.visible) {
        model.visible = false;
        // XXX this will need to be changed if any animation will be
        // implemented to hide
        model.hide();
      }
    });
    setStripes();
  };

  /**
   * show all certified dt
   */
  function showCertified() {
    $('dt.certified').removeClass('hidden');
    setStripes();
  }; 

  /**
   * toggles certified dt's
   */
  function toggleCeritified() {
    if (certifiedVisible) {
      hideCertified();
    } else {
      showCertified();
    }
    certifiedVisible = !certifiedVisible;
  };

  $('#header-settings').on('click', toggleCeritified);
});
