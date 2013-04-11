define(function(require) {

  var $ = require('elements');
  require('elements/events');
  require('elements/traversal');    // $ searches elements using Slick
  var setStripes = require('./ui').setStripes;

  // TODO: make this a setting
  var certifiedVisible = true;

  var hideCertified = function() {
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
  };

  var showCertified = function() {
    $('dt.certified').removeClass('hidden');
  }; 

  var toggleCeritified = function() {
    if (certifiedVisible) {
      hideCertified();
    } else {
      showCertified();
    }
    setStripes();
    certifiedVisible = !certifiedVisible;
  };

  $('#header-settings').on('click', toggleCeritified);
});
