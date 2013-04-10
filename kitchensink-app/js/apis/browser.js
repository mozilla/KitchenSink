define(function(require) {
  var $ = require('elements');
  var elements = require('utils').elements;
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'browserapi',
    name: 'Browser API',
    description: 'Enables implementing a browser completely in web technologies.',
    bugs: [693515],
    info: 'https://developer.mozilla.org/en-US/docs/DOM/Using_the_Browser_API',
    noPreparation: true,
    tests: [
      function(callback) {
        var test = 'methods present in browser tag';
        var failed = false;
        var fail = [];
        var methods = ['stop', 'reload', 'go', 'getScreenShot'];
        elements('<iframe id="browser"></iframe>').insert($('body'));
        var browser = $('#browser');

        methods.forEach(function(method) {
          if (!(method in browser)) {
            failed = true;
            fail.push(method);
          }
        });
        callback(!failed, test, fail.join(', '));
        browser.remove();
      }
    ]
  });
});
