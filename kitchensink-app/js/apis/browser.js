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
    info: 'https://developer.mozilla.org/en-US/docs/WebAPI/Browser',
    noPreparation: true,
    tests: [
      function(callback) {
        var test = 'methods present in browser element';
        var failed = false;
        var fail = [];
        var methods = ['stop', 'reload', 'goForward', 'goBack'];
        elements('<iframe id="browser" mozbrowser></iframe>').insert($('body'));
        var browser = document.getElementById('browser');

        methods.forEach(function(method) {
          if (!(method in browser)) {
            failed = true;
            fail.push(method);
          }
        });
        callback(!failed, test, fail.join(', '));
        browser.parentNode.removeChild(browser);
      }
    ]
  });
});
