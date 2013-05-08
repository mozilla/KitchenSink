// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {

  require('string'); // modifies String prototype
  var $ = require('elements');
  require('elements/events');       // used for .on()
  require('elements/attributes');   // .html() in utils.js
  require('elements/insertion');    // .insert() in logger and models.js
  require('elements/traversal');    // $ searches elements using Slick
  var renderCertified = require('./ui').renderCertified;
  var apis = require('./apis/index');
  var log = require('logger');

  $('#header-reload').on('click', function() { 
    window.location.reload(); 
  });

  // TODO: find out some more fancy way of showing the settings
  $('#header-settings').on('click', function() {
      $('#body-content').addClass('hidden');
      $('#body-settings').removeClass('hidden');
  });
  $('#settings-done').on('click', function() {
      $('#body-content').removeClass('hidden');
      $('#body-settings').addClass('hidden');
  });

  for (var id in apis) {
    var api = apis[id];
    // render <dt> and <dd> inside <dl id="apis">
    // assign action if provided
    api.render($('#apis'));
    // check if DOM is prepared
    api.testPreparation();
    // run tests if provided
    api.runTests();
  }

  renderCertified();

  if ('MozActivity' in window) {
    // change all links to webactivities
    var viewUrl = function(event) {
      event.preventDefault();
      new MozActivity({
        name: 'view',
        data: {
            type: 'url', // Possibly text/html in future versions
            url: event.target.href
        }
      });
    };
    $('a').on('click', viewUrl);
  }
});
