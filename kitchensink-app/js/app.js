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

    // check if DOM is prepared
    if (api.isPrepared) {
      var prepared = api.isPrepared()
      $('#' + id).append('<span class="' + 
                         (prepared ? 'success' : 'fail') + '">' + 
                         (prepared ? '+' : '-') + '</span>');
      if (prepared) {
        // run tests only id DOM prepared
        if (api.tests) {
          api.tests.forEach(function(test) {
            test.run(function callback(result) {
              $('#' + id).append('<span class="' + 
                                 (result ? 'success' : 'fail') + '">' + 
                                 (result ? '.' : '!') + '</span>');
              if (!result) {
                log.error(api.name + ' ' + test.name + ' failed');
              }  
            });
          });
        }
      } else {
        var message = api.name + ' is not prepared';
        if (api.tests) {
          message += ' (tests not run)';
        }
        log.error(message);
      }
    }
  }
});
