// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {

  var $ = require('zepto');
  var apis = require('./apis');
  var log = require('logger');

  var testElement = $('#apis');

  for (id in apis) {
    var api = apis[id];

    // add li
    var apiHTML = '<li id="' + id + '">' + api.name + '</span></li>';
    testElement.append(apiHTML);

    // check if JS is prepared
    if (api.isPrepared) {
      log.debug(api.name + ' ' + api.isPrepared());
      $('#' + id).append('<span class="prepared">' + 
                         (api.isPrepared() ? '+' : '-') +
                         '</span>');
    }
    // run tests
    if (api.tests) api.tests.forEach(function(test) {
      test(function callback(result) {
        $('#' + id).append('<span class="test">' + 
                           (result ? '+' : '-') +
                           '</span>');
        
      });
    });
  }
});
