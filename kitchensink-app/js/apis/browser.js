define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'browser',
    name: 'Browser API',
    description: 'Enables implementing a browser completely in web technologies.',
    bugs: [693515],
    info: 'https://wiki.mozilla.org/WebAPI/BrowserAPI',
    noPreparation: true,
    tests: [
      function(callback) {
        var test = 'methods present in browser tag';
        var failed = false;
        var fail = [];
        var methods = ['stop', 'reload', 'go', 'getScreenShot'];
        $('body').append('<browser id="testBrowser">');
        var browser = $('#testBrowser');

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
