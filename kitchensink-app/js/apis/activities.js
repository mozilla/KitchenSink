define(function(require) {
  var log = require('logger');
  var API = require('./models').API;

  return new API({
    id: 'activities',
    name: 'Web Activities',
    description: 'Delegate an activity to another application.',
    bugs: [715814, 776027],
    info: 'https://wiki.mozilla.org/WebAPI/WebActivities',
    isPrepared: function() {
      return ('MozActivity' in window);
    },
    tests: [
      /* TODO: find a way to not call activity on test
      function(callback) {
        var test = 'listeners defined in new Activity';
        try {
          var activ = new MozActivity({ 
            name: 'pick', data: {type: 'image/png', multiple: false}});
        } catch(e) {
          return callback(false, test, 'error: ' + e);
        }
        var isValid = ('onsuccess' in active && 'onerror' in active);
        callback(isValid, test);
      }
       */
    ]
  });
});
