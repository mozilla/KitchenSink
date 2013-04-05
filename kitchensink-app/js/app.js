// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {

  var $ = require('zepto');
  var apis = require('./apis/index');
  var log = require('logger');

  // navigation
  $('#reload').on('click', function() { window.location.reload(); });

  for (var id in apis) {
    var api = apis[id];
    // render <li> inside <ul id="apis">
    // assign action if provided
    api.render($('#apis'));
    // check if DOM is prepared
    api.testPreparation();
    // run tests if provided
    api.runTests();
  }

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
