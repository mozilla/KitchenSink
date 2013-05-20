define(function(require) {
  var settings = require('settings');
  var $ = require('elements');
  require('elements/events');
  require('elements/attributes');
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
  }

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
  }

  /**
   * show all certified dt
   */
  function showCertified() {
    $('dt.certified').removeClass('hidden');
    setStripes();
  } 

  /**
   * toggles certified dt's
   */
  function toggleCeritified() {
    settings.set('certifiedVisible', !settings.get('certifiedVisible'));
  }

  /**
   * show hide certified regarding the setting
   */
  function renderCertified() {
    if (settings.get('certifiedVisible')) {
      showCertified();
    } else {
      hideCertified();
    }
  }

  // render certified on change of the setting
  settings.on('certifiedVisible', renderCertified);

  return {
    setStripes: setStripes,
    renderCertified: renderCertified
  };
});
